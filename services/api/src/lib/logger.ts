type Level = 'info' | 'warn' | 'error'
type Fields = Record<string, unknown>

function write(level: Level, msg: string, fields?: Fields) {
  const line = JSON.stringify({ level, msg, time: new Date().toISOString(), ...fields })
  if (level === 'error') console.error(line)
  else console.log(line)
}

export const logger = {
  info: (msg: string, fields?: Fields) => write('info', msg, fields),
  warn: (msg: string, fields?: Fields) => write('warn', msg, fields),
  error: (msg: string, fields?: Fields) => write('error', msg, fields)
}

export function serializeError(error: unknown) {
  if (error instanceof Error) return { name: error.name, message: error.message, stack: error.stack }
  return { message: String(error) }
}
