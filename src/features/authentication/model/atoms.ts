import { z } from 'zod'

export const emailAtom = (msg?: string) => z.string().email(msg)

export const passwordAtom = (msgs?: { tooShort?: string; tooLong?: string }) =>
  z.string().min(8, msgs?.tooShort).max(72, msgs?.tooLong)

export const passwordRequiredAtom = (msg?: string) => z.string().min(1, msg)

export const codeAtom = (msgs?: { length?: string; numeric?: string }) =>
  z
    .string()
    .length(6, msgs?.length)
    .regex(/^\d{6}$/, msgs?.numeric)

export const nameAtom = (msgs?: { tooShort?: string; tooLong?: string }) =>
  z.string().trim().min(2, msgs?.tooShort).max(50, msgs?.tooLong)
