import { LogModel, type LogType } from './logs.model'

export type LogEntry = { type: LogType; message: string; metadata?: Record<string, unknown> }

export async function insertLog(entry: LogEntry) {
  await LogModel.create(entry)
}
