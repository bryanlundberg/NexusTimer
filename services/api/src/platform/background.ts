import { logger, serializeError } from '../lib/logger'

export type RunInBackground = (scope: string, task: () => Promise<unknown>) => void

export function runInBackground(scope: string, task: () => Promise<unknown>) {
  return Promise.resolve()
    .then(task)
    .catch((error: unknown) => logger.error('background task failed', { scope, error: serializeError(error) }))
}
