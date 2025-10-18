import PlayerMiniCard from '@/components/clash/player-mini-card/player-mini-card'

export default function UsersTab({
  players
}: {
  players: Array<{ id: string; name: string; image: string; status: string }>
}) {
  const playerss = [
    {
      id: '1',
      name: 'Alice',
      image:
        'https://cdn.jsdelivr.net/gh/itspi3141/discord-fake-avatar-decorations@main/public/avatars/trick_or_treat.png',
      status: 'online'
    },
    {
      id: '2',
      name: 'Bob',
      image:
        'https://cdn.jsdelivr.net/gh/itspi3141/discord-fake-avatar-decorations@main/public/avatars/trick_or_treat.png',
      status: 'offline'
    },
    {
      id: '3',
      name: 'Charlie',
      image:
        'https://cdn.jsdelivr.net/gh/itspi3141/discord-fake-avatar-decorations@main/public/avatars/trick_or_treat.png',
      status: 'online'
    },
    {
      id: '4',
      name: 'Diana',
      image:
        'https://cdn.jsdelivr.net/gh/itspi3141/discord-fake-avatar-decorations@main/public/avatars/trick_or_treat.png',
      status: 'away'
    },
    {
      id: '5',
      name: 'Eve',
      image:
        'https://cdn.jsdelivr.net/gh/itspi3141/discord-fake-avatar-decorations@main/public/avatars/trick_or_treat.png',
      status: 'online'
    },
    {
      id: '6',
      name: 'Frank',
      image:
        'https://cdn.jsdelivr.net/gh/itspi3141/discord-fake-avatar-decorations@main/public/avatars/trick_or_treat.png',
      status: 'offline'
    },
    {
      id: '7',
      name: 'Grace',
      image:
        'https://cdn.jsdelivr.net/gh/itspi3141/discord-fake-avatar-decorations@main/public/avatars/trick_or_treat.png',
      status: 'online'
    }
  ]

  return (
    <div className={'flex flex-wrap gap-2'}>
      {playerss.map((player) => (
        <PlayerMiniCard key={player.id} name={player.name} avatarUrl={player.image} />
      ))}
    </div>
  )
}
