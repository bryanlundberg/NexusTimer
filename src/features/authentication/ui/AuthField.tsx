import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = React.ComponentProps<typeof Input> & {
  label: string
  error?: string
}

export default function AuthField({ label, error, id, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={!!error} {...props} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
