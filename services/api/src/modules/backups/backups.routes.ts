import { BACKUP_TIMEZONE_HEADER, type BackupDeleteResponse, type BackupFile } from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { badRequest, notFound, ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { isValidBackupFile } from './backups.files'
import type { BackupsService } from './backups.service'

export function backupsRoutes(backups: BackupsService, signedIn: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>()
    .post('/', signedIn, async (c) => {
      try {
        const body = new Uint8Array(await c.req.arrayBuffer())
        if (body.length === 0) return badRequest('Empty backup')
        backups.queueUpload(c.var.userId, body, c.req.header(BACKUP_TIMEZONE_HEADER) ?? null)
        return new Response(null, { status: 202 })
      } catch (error) {
        return serverError('backups:POST', error)
      }
    })
    .get('/', signedIn, async (c) => {
      try {
        return ok<BackupFile[]>(await backups.list(c.var.userId))
      } catch (error) {
        return serverError('backups:GET', error)
      }
    })
    .delete('/', signedIn, async (c) => {
      try {
        const file = c.req.query('file')
        if (!file || !isValidBackupFile(file)) return badRequest('Invalid backup file')

        const result = await backups.remove(c.var.userId, file)
        return result ? ok<BackupDeleteResponse>(result) : notFound('Backup not found')
      } catch (error) {
        return serverError('backups:DELETE', error)
      }
    })
}
