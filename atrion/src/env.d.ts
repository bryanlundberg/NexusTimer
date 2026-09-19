/// <reference types="astro/client" />

import type { SessionUser } from '@/features/auth/model/session'

declare global {
  namespace App {
    interface Locals {
      user: SessionUser | null
    }
  }
}

export {}
