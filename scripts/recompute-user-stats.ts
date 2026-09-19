import mongoose, { Types } from 'mongoose'
import connectDB from '@/shared/config/mongodb/mongodb'
import { getRedis } from '@/shared/config/redis/redis'
import {
  countUsersWithBackup,
  recomputeBatch,
  recomputeUser,
  type RecomputeBatchResult,
  type RecomputeUserResult
} from '@/entities/user-stats/server/recompute-user-stats'

const BATCH_SIZE = 50
const RETRY_DELAY_MS = 3000
const MAX_RETRY_DELAY_MS = 30_000

function parseArgs(argv: string[]) {
  const valueOf = (flag: string) => {
    const index = argv.indexOf(flag)
    return index >= 0 ? argv[index + 1] : undefined
  }
  return { force: argv.includes('--force'), userId: valueOf('--user'), from: valueOf('--from') }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function closeConnections() {
  await mongoose.disconnect().catch(() => {})
  await getRedis()
    .then((redis) => redis.quit())
    .catch(() => {})
}

async function batchWithRetry(
  cursor: string | undefined,
  force: boolean,
  onUser: (result: RecomputeUserResult) => void
): Promise<RecomputeBatchResult> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await recomputeBatch({ cursor, limit: BATCH_SIZE, force, onUser })
    } catch (error) {
      const delay = Math.min(RETRY_DELAY_MS * attempt, MAX_RETRY_DELAY_MS)
      console.warn(
        `  batch after ${cursor ?? 'start'} failed (attempt ${attempt}), retrying in ${delay / 1000}s: ${error}`
      )
      await sleep(delay)
    }
  }
}

// Flags: --user <id> rebuilds one user, --force also rebuilds up to date summaries, --from <id> resumes after that user.
async function main() {
  const { force, userId, from } = parseArgs(process.argv.slice(2))
  for (const [flag, id] of [
    ['--user', userId],
    ['--from', from]
  ]) {
    if (id !== undefined && !Types.ObjectId.isValid(id)) throw new Error(`${flag} needs a valid user id`)
  }
  const startedAt = Date.now()

  const connected = await connectDB()
  if (!connected) throw new Error('Could not connect to MongoDB, is MONGODB_URI set?')

  if (userId) {
    const outcome = await recomputeUser(userId)
    console.log(outcome ? `${userId}: ${outcome}` : `${userId}: user not found`)
    return
  }

  const total = await countUsersWithBackup()
  console.log(`Users with a backup: ${total}${force ? ' (forced)' : ''}${from ? `, resuming after ${from}` : ''}\n`)

  const width = String(total).length
  const failures: { userId: string; error: string }[] = []
  const counts = { rebuilt: 0, fresh: 0, noBackup: 0 }
  let done = 0

  const onUser = (result: RecomputeUserResult) => {
    done++
    const position = `[${String(done).padStart(width)}/${total}]`
    if ('error' in result) {
      failures.push({ userId: result.userId, error: result.error })
      console.log(`${position} ${result.userId}  FAILED   ${result.error}`)
      return
    }
    if (result.outcome === 'rebuilt') counts.rebuilt++
    else if (result.outcome === 'fresh') counts.fresh++
    else counts.noBackup++
    console.log(`${position} ${result.userId}  ${result.outcome.padEnd(8)} ${result.ms}ms`)
  }

  let cursor = from
  do {
    const batch = await batchWithRetry(cursor, force, onUser)
    cursor = batch.nextCursor ?? undefined
  } while (cursor)

  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1)
  console.log(
    [
      '',
      `Done in ${seconds}s.`,
      `  processed: ${done}`,
      `  rebuilt:   ${counts.rebuilt}`,
      `  fresh:     ${counts.fresh}`,
      `  no backup: ${counts.noBackup}`,
      `  failed:    ${failures.length}`
    ].join('\n')
  )
  for (const failure of failures) console.log(`    ${failure.userId}: ${failure.error}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(closeConnections)
