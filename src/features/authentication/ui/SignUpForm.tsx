'use client'

import { useState } from 'react'
import type { SignUpValues } from '@/features/authentication/model/schemas'
import SignUpDetailsStep from '@/features/authentication/ui/SignUpDetailsStep'
import SignUpVerifyStep from '@/features/authentication/ui/SignUpVerifyStep'

export default function SignUpForm() {
  const [pending, setPending] = useState<SignUpValues | null>(null)

  if (pending) {
    return <SignUpVerifyStep email={pending.email} password={pending.password} />
  }
  return <SignUpDetailsStep onSuccess={setPending} />
}
