import { Button } from '@/components/ui/button';
import { LoaderCircle, Share2Icon } from 'lucide-react';
import { useUsers } from '@/hooks/api/useUsers';
import PlayerMiniCard from '../player-mini-card/player-mini-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card'
import { Input } from '@/components/ui/input';

export default function AwaitingMatch() {
  const { data: users } = useUsers()
  console.log(users)
  return (
    <div className={'grid grid-cols-1'}>
      <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-center mt-2 [text-shadow:0_0_7px_rgba(255,255,255,0.8)] pt-2">Clash
        Of
        Cubing</h1>
      <div className="text-muted-foreground text-sm flex items-center justify-center gap-2 mt-2">
        <LoaderCircle size={16} className={'animate-spin'}/>
        <div>
          <div>Please wait while more people join your game.</div>
          <div>At least 2 players are required to start a clash.</div>
        </div>
      </div>
      <Button variant={'secondary'} className={'w-fit mx-auto mt-4'}>Leave clash</Button>

      <div className={'flex flex-col justify-center items-center mt-5 text-lg font-semibold text-muted-foreground grow'}>
        <h3>Clash starts in 1:45</h3>
        <div className={'grid grid-cols-4 gap-2 mt-5'}>
          <PlayerMiniCard/>
          <PlayerMiniCard/>
          <PlayerMiniCard/>
          <PlayerMiniCard/>
          <PlayerMiniCard/>
          <PlayerMiniCard/>
          <PlayerMiniCard/>
          <PlayerMiniCard/>
        </div>
      </div>

      <div className={'px-4'}>
        <Card className="max-w-[500px] w-full mx-auto mt-5 mb-10">
          <CardHeader>
            <CardTitle className={'flex gap-2'}><Share2Icon size={16}/> Share this Clash</CardTitle>
            <CardDescription>Clash of Cubing - 3x3</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Input
              value={'http://localhost:3000/clash/5873285432'}
              readOnly
              className="cursor-pointer"
            />
            <Button variant="outline" className="shrink-0">Copy</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
