'use client'

import { useTranslations } from 'next-intl'
import type { AuthSchemaMessages } from './schemas'

export function useAuthSchemaMessages(): AuthSchemaMessages {
  const t = useTranslations('Index.Auth.validation')

  return {
    emailInvalid: t('email-invalid'),
    passwordRequired: t('password-required'),
    passwordTooShort: t('password-too-short'),
    passwordTooLong: t('password-too-long'),
    nameTooShort: t('name-too-short'),
    nameTooLong: t('name-too-long'),
    codeLength: t('code-length'),
    codeNumeric: t('code-numeric')
  }
}
