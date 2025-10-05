'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import FadeIn from '@/components/fade-in/fade-in';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select'
import { Label } from '@/components/ui/label';
import { useLeaderboards } from '@/hooks/api/useLeaderboards';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import formatTime from '@/lib/formatTime';
import { ScrambleDisplay } from '@/components/scramble-display';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger, } from '@/components/ui/tooltip'
import { GlobeAmericasIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import * as React from 'react';
import { LeaderboardSolveModal } from '@/components/modals/leaderboard-solve-modal';
import { useLeaderboardSolveModal } from '@/store/LeaderboardSolveModal';
import calcTurnsPerSecond from '@/lib/calcTurnsPerSecond';
import { Spinner } from '@/components/ui/spinner';

export default function Page() {
  const { data: solves, isLoading } = useLeaderboards()
  const router = useRouter()
  const openModal = useLeaderboardSolveModal(state => state.openModal);

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <FadeIn className={'p-4 md:p-8 space-y-8'}>
        <div className="flex flex-col w-full">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-primary">Leaderboard Rankings</h1>
          <p className="text-lg text-muted-foreground text-center mb-4 max-w-xl mx-auto">
            Explore the top 100 performers and their solves across various categories. Discover detailed insights about
            each participant and their achievements.
          </p>
        </div>

        <div className={'flex flex-row gap-3'}>
          <div className={'flex flex-col gap-3'}>
            <Label>Type</Label>
            <Select defaultValue="3x3-keyboard">
              <SelectTrigger>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3x3-keyboard">Virtual 3x3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className={'flex flex-row gap-3 justify-center items-center'}><Spinner/> Thinking...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead className="w-full md:w-auto">User</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Scramble</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="hidden sm:table-cell">Image</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(solves && solves.length > 0 ? solves : []).map((solve: any, index: number) => {
                return (
                  <TableRow key={solve._id} onClick={() => openModal(solve)}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium overflow-hidden max-w-20 sm:max-w-32 md:max-w-40 lg:max-w-96 whitespace-normal">

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={'flex flex-row items-center justify-center gap-2 hover:underline'}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/people/${solve.user._id}`);
                            }}
                          >
                            <Avatar>
                              <AvatarImage className={'object-cover'} src={solve.user.image}/>
                              <AvatarFallback>{solve.user.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            {solve.user.name}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <h2 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance flex items-center justify-center gap-2">
                            {solve.user.name} {solve.user?.pronoun && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground font-normal">
                              <span>{solve.user?.pronoun}</span>
                            </div>
                          )}
                          </h2>

                          {solve.user?.timezone &&
                            <div className={'flex items-center gap-1'}>
                              <GlobeAmericasIcon className={'size-5'}/>
                              {solve.user?.timezone}
                              <span className={'opacity-50'}>({new Intl.DateTimeFormat('en-US', {
                                timeZone: solve.user.timezone,
                                timeStyle: 'short'
                              }).format(new Date())})</span>
                            </div>}
                          {solve.user?.goal && <Badge>{solve.user?.goal}</Badge>}
                        </TooltipContent>
                      </Tooltip>

                    </TableCell>
                    <TableCell className="font-medium hidden sm:table-cell">{solve.puzzle}</TableCell>
                    <TableCell className="font-medium hidden md:table-cell overflow-hidden max-w-20 sm:max-w-32 md:max-w-40 lg:max-w-96 whitespace-normal">{solve.solution ? `${calcTurnsPerSecond(solve.solution, solve.time)} tps` : 'N/A'}</TableCell>
                    <TableCell>{formatTime(solve.time)}</TableCell>
                    <TableCell className="hidden sm:table-cell text-right">
                      <ScrambleDisplay className={'size-20'} show scramble={solve.scramble} event={solve.puzzle}/>
                    </TableCell>
                    <TableCell className="font-medium hidden sm:table-cell">{format(new Date(solve.createdAt), 'd MMM yyyy')}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        <LeaderboardSolveModal/>
      </FadeIn>
    </ScrollArea>
  );
}
