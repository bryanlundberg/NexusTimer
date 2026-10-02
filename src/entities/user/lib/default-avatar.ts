export function defaultAvatarUrl(name: string | null | undefined): string {
  const encoded = (name ?? '').replace(/\s+/g, '+')
  return `https://ui-avatars.com/api/?name=${encoded}&background=random&size=128`
}
