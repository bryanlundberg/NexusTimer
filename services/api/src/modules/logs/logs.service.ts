import { logger, serializeError } from '../../lib/logger'
import { insertLog, type LogEntry } from './logs.repository'

export type { LogEntry }

export async function recordLog(entry: LogEntry) {
  try {
    await insertLog(entry)
  } catch (error) {
    logger.error('log write failed', { type: entry.type, error: serializeError(error) })
  }
}
