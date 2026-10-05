import { compare, hash } from 'bcryptjs'

const PASSWORD_HASH_ROUNDS = 12

export function hashPassword(password: string) {
  return hash(password, PASSWORD_HASH_ROUNDS)
}

export function verifyPassword({ hash: passwordHash, password }: { hash: string; password: string }) {
  return compare(password, passwordHash)
}
