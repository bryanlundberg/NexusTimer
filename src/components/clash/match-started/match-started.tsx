'use client'
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Hourglass } from 'lucide-react';
import { cubeCollection } from '@/lib/const/cubeCollection';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Rnd } from 'react-rnd';
import ScrambleDisplayDraggable from '@/components/clash/scramble-display-draggable/scramble-display-draggable';
import { useClashWindows } from '@/store/clash-windows';
import Sidebar from '@/components/clash/sidebar/sidebar';
import Lobby from '@/components/clash/lobby/lobby';
import Chat from '@/components/clash/chat/chat';
import { useClashManager } from '@/store/ClashManager';
import { useCountdown } from '@/hooks/useCountdown';
import useTimer from '@/hooks/useTimer';
import { useTimerStore } from '@/store/timerStore';
import { Cube } from '@/interfaces/Cube';
import formatTime from '@/lib/formatTime';
import { useSession } from 'next-auth/react';
import { useRoomUtils } from '@/hooks/useRoomUtils';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { Entry } from '@/interfaces/Entry';

interface MatchStartedProps {
  broadcast: (message: Entry) => void;
}

export default function MatchStarted({ broadcast }: MatchStartedProps) {
  const chat = useClashWindows((s) => s.chat);
  const lobby = useClashWindows((s) => s.lobby);
  const setPosition = useClashWindows((s) => s.setPosition);
  const setSize = useClashWindows((s) => s.setSize);
  const room = useClashManager(state => state.room);
  const roundEndTime = useMemo(() => {
    const idx = Math.max(0, (room?.rounds || []).findIndex((r) => r?.status === 'open'));
    return room?.rounds?.[idx]?.plannedEndTime;
  }, [room?.rounds]);
  const { mmss, isFinished } = useCountdown(roundEndTime);
  const { data: session } = useSession();
  const { updateDocument } = useFirestoreCache();
  const { applySolve, cloneRoom } = useRoomUtils();

  const isSolving = useTimerStore((s) => s.isSolving);
  const setTimerStatus = useTimerStore((s) => s.setTimerStatus);
  const setIsSolving = useTimerStore((s) => s.setIsSolving);
  const setSolvingTime = useTimerStore((s) => s.setSolvingTime);
  const timerMode = useTimerStore((s) => s.timerMode);

  const solvingTime = useTimerStore((s) => s.solvingTime);

  const [pendingPenalty, setPendingPenalty] = useState<null | '+2' | 'DNF'>(null);
  // Local lock to absolutely prevent re-starts until next round
  const [localSubmitted, setLocalSubmitted] = useState<boolean>(false);

  // Modal control for post-solve penalty selection
  const [penaltyModalOpen, setPenaltyModalOpen] = useState<boolean>(false);
  const [finishedTimeMs, setFinishedTimeMs] = useState<number | undefined>(undefined);

  const submitSolve = useCallback(async (rawMs: number, penalty: null | '+2' | 'DNF') => {
    if (!room || !session?.user?.id) return;
    const openIndex = (room.rounds || []).findIndex((r) => r?.status === 'open');
    if (openIndex === -1) return;
    const r = room.rounds![openIndex];
    const updatedRound = applySolve(r as any, session.user.id as string, rawMs, penalty);
    const newRoom = cloneRoom(room);
    newRoom.rounds![openIndex] = updatedRound as any;
    await updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${room.id}`, {
      rounds: newRoom.rounds,
    });
  }, [room, session?.user?.id, applySolve, cloneRoom, updateDocument]);

  const currentRoundIndex = useMemo(() => {
    return Math.max(0, (room?.rounds || []).findIndex((r) => r?.status === 'open'));
  }, [room?.rounds]);

  const myEntry = useMemo(() => {
    const uid = session?.user?.id as string | undefined;
    if (!uid) return undefined;
    const round = room?.rounds?.[currentRoundIndex] as any;
    return round?.entries?.[uid];
  }, [room?.rounds, currentRoundIndex, session?.user?.id]);

  const roundStatus = room?.rounds?.[currentRoundIndex]?.status;
  const hasSubmittedCurrentRound = Boolean(myEntry?.participated);
  const canSolve = roundStatus === 'open' && !hasSubmittedCurrentRound && !localSubmitted && !isFinished;

  // If Firestore says we submitted, ensure local lock is set
  useEffect(() => {
    if (hasSubmittedCurrentRound) setLocalSubmitted(true);
  }, [hasSubmittedCurrentRound]);

  // When the open round changes, reset local lock
  useEffect(() => {
    setLocalSubmitted(false);
  }, [currentRoundIndex]);

  // Guard: prevent starting a new solve after submission or when time is up, and stop if not allowed
  useEffect(() => {
    if (!canSolve && isSolving) {
      setIsSolving(false);
    }
  }, [canSolve, isSolving, setIsSolving]);

  // Hard cutoff: when countdown finishes, stop the local timer immediately
  useEffect(() => {
    if (isFinished && isSolving) {
      stopTimer()
    }
  }, [isFinished, isSolving, setIsSolving]);

  // When the round changes, fully reset local UI/timer and close any pending modal to avoid being locked
  useEffect(() => {
    setPenaltyModalOpen(false);
    setFinishedTimeMs(undefined);
    setPendingPenalty(null);
    setIsSolving(false);
    setSolvingTime(0);
    resetAll();
  }, [currentRoundIndex]);

  const guardedSetIsSolving = useCallback((v: boolean) => {
    if (v && (!canSolve || penaltyModalOpen)) return; // ignore attempts to start when not allowed or when confirming result
    setIsSolving(v);
  }, [canSolve, penaltyModalOpen, setIsSolving]);

  const { stopTimer, resetAll } = useTimer({
    isSolving,
    setTimerStatus,
    selectedCube: canSolve && !penaltyModalOpen ? ({} as Cube) : null,
    inspectionRequired: false,
    setIsSolving: guardedSetIsSolving,
    setSolvingTime,
    timerMode,
    settings: { timer: { startCue: false, holdToStart: false } },
    onFinishSolve: () => {
      if (solvingTime !== undefined) {
        // Open modal to select penalty before submitting
        setFinishedTimeMs(solvingTime);
        setPenaltyModalOpen(true);
      }
    }
  });

  const players = useMemo(() => {
    return Object.values(room?.presence || {}).map((user) => user);
  }, [room?.presence]);

  const selectedCube = useMemo(() => {
    const byName = cubeCollection.find((c) => c.name === room?.event);
    const defaultThree = cubeCollection.find((c) => c.name === '3x3') || cubeCollection[0];
    return byName || defaultThree;
  }, [room?.event]);

  const totalRounds = room?.totalRounds || (room?.rounds?.length || 0);
  const scramble = room?.rounds?.[currentRoundIndex]?.scramble as string | undefined;

  return (
    <div className={'flex w-full min-h-dvh max-h-dvh overflow-hidden bg-sidebar'}>
      <Sidebar/>

      <div className={'w-full flex flex-col bg-background m-2 rounded-md'}>
        <div className={'p-1 flex flex-wrap items-center gap-2 text-xs px-4 pt-2 text-muted-foreground'}>
          <Image src={selectedCube?.src} alt={'Clash Icon'} width={20} height={20}/>
          <span>{selectedCube?.name ?? room?.event ?? '3x3'}</span>
          <span className={'flex items-center gap-1'}>
            <Hourglass size={14} fill={'#fff'}/>
            <span>Time left {mmss}</span>
          </span>
        </div>

        <div className={'flex flex-col justify-start items-center h-full'}>
          <div className={'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'}>
            Round {currentRoundIndex + 1}/{totalRounds}
          </div>
          <div className={'px-4 text-center md:text-2xl 2xl:text-3xl'}>
            {scramble || '...'}
          </div>
          <div className={'text-4xl md:text-5xl lg:text-6xl xl:text-9xl grow flex items-center-safe justify-center w-full'}>
            {formatTime(solvingTime)}
          </div>
          <div className={'pb-3 flex flex-col items-center gap-2'}>
            {(hasSubmittedCurrentRound || localSubmitted) && (
              <div className={'text-sm text-muted-foreground'}>waiting for others ....</div>
            )}
          </div>
        </div>

        {chat.isOpen && (
          <Rnd
            className={'z-0 rounded-md bg-card border border-border'}
            dragHandleClassName={'chat-drag-handle'}
            default={{
              x: chat.x,
              y: chat.y,
              width: chat.width,
              height: chat.height,
            }}
            minWidth={300}
            minHeight={200}
            bounds="parent"
            onDragStop={(e, d) => setPosition('chat', d.x, d.y)}
            onResizeStop={(e, dir, ref, delta, position) => {
              const width = parseFloat(ref.style.width);
              const height = parseFloat(ref.style.height);
              setSize('chat', width, height);
              setPosition('chat', position.x, position.y);
            }}
          >
            <Chat broadcast={broadcast}/>
          </Rnd>
        )}

        {lobby.isOpen && (
          <Rnd
            className={'z-0 rounded-md bg-card border border-border'}
            default={{
              x: lobby.x,
              y: lobby.y,
              width: lobby.width,
              height: lobby.height,
            }}
            minWidth={240}
            minHeight={120}
            bounds="parent"
            onDragStop={(e, d) => setPosition('lobby', d.x, d.y)}
            onResizeStop={(e, dir, ref, delta, position) => {
              const width = parseFloat(ref.style.width);
              const height = parseFloat(ref.style.height);
              setSize('lobby', width, height);
              setPosition('lobby', position.x, position.y);
            }}
          >
            <div className={'p-2 overflow-auto h-full'}>
              <Lobby players={players}/>
            </div>
          </Rnd>
        )}

        <ScrambleDisplayDraggable/>

        <Dialog open={penaltyModalOpen}>
          <DialogContent showCloseButton={false} onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Submit</DialogTitle>
              <DialogDescription>
                Final time: {finishedTimeMs !== undefined ? formatTime(finishedTimeMs) : '---'}
              </DialogDescription>
            </DialogHeader>
            <div className={'flex flex-col gap-2'}>
              <div className={'flex flex-col sm:flex-row gap-2'}>
                <Button variant={'destructive'} className={"grow"} onClick={async () => {
                  if (finishedTimeMs === undefined) return;
                  await submitSolve(finishedTimeMs, 'DNF');
                  setLocalSubmitted(true);
                  setPendingPenalty(null);
                  setPenaltyModalOpen(false);
                }}>DNF</Button>
                <Button variant={'outline'} className={"grow"} onClick={async () => {
                  if (finishedTimeMs === undefined) return;
                  await submitSolve(finishedTimeMs, '+2');
                  setLocalSubmitted(true);
                  setPendingPenalty(null);
                  setPenaltyModalOpen(false);
                }}>+2</Button>
                <Button className={"grow"} onClick={async () => {
                  if (finishedTimeMs === undefined) return;
                  await submitSolve(finishedTimeMs, null);
                  setLocalSubmitted(true);
                  setPendingPenalty(null);
                  setPenaltyModalOpen(false);
                }}>Ok</Button>
              </div>
            </div>
            <DialogFooter>
              <div className={'text-xs text-muted-foreground'}>
                Once submitted, your result cannot be changed.
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
