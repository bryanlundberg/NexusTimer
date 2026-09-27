import AuthBackground from '@/features/authentication/ui/AuthBackground'

interface Props {
  variant: 'signin' | 'signup'
  title: string
  subtitle: string
  footer: React.ReactNode
  children: React.ReactNode
}

export default function AuthScreen({ variant, title, subtitle, footer, children }: Props) {
  return (
    <div className="relative flex flex-1 items-center justify-center px-5 py-12">
      <AuthBackground variant={variant} />

      <div className="relative flex w-full max-w-sm flex-col gap-8">
        <header className="auth-rise flex flex-col gap-2">
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </header>
        <div className="auth-rise flex flex-col gap-6 [--d:80ms]">{children}</div>
        <div className="auth-rise [--d:160ms]">{footer}</div>
      </div>
    </div>
  )
}
