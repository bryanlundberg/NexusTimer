import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

export default function DevLogin() {
  if (process.env.NODE_ENV === 'production') return null

  return <Button onClick={() => signIn('dev-login')}>Developer Login</Button>
}
