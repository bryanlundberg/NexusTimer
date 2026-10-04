import {
  BACKUP_TIMEZONE_HEADER,
  type BackupDeleteResponse,
  type BackupFile,
  type BackupUploadResponse
} from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { badRequest, notFound, ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { isValidBackupFile } from './backups.files'
import type { BackupPayloadError, BackupsService } from './backups.service'

const PAYLOAD_ERRORS: Record<BackupPayloadError, () => Response> = {
  'empty-body': () => serverError('backups:POST', new Error('Empty body')),
  malformed: () => badRequest('Malformed backup payload'),
  'empty-backup': () => serverError('backups:POST', new Error('Empty backup')),
  'too-large': () => serverError('backups:POST', new Error('Backup too large')),
  'not-json': () => badRequest('Backup is not valid JSON')
}

export function backupsRoutes(backups: BackupsService, signedIn: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>()
    .post('/', signedIn, async (c) => {
      try {
        const body = new Uint8Array(await c.req.arrayBuffer())
        const result = await backups.upload(c.var.userId, body, c.req.header(BACKUP_TIMEZONE_HEADER) ?? null)
        if ('backup' in result) return ok<BackupUploadResponse>(result.backup)
        return result.error === 'user-not-found' ? notFound('User not found') : PAYLOAD_ERRORS[result.error]()
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
