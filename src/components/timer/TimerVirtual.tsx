'use client';
import React from 'react';
import { TwistyPlayer } from 'cubing/twisty';
import { useTimerStore } from '@/store/timerStore';
import { CubeEngine } from 'cube-state-engine';
import formatTime from '@/lib/formatTime';
import { Solve } from '@/interfaces/Solve';
import genId from '@/lib/genId';
import { useNXData } from '@/hooks/useNXData';
import MenuSolveOptions from '@/components/menu-solve-options/menu-solve-options';
import { useSettingsModalStore } from '@/store/SettingsModalStore';

export default function TimerVirtual() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [player, setPlayer] = React.useState<TwistyPlayer | null>(null);
  const scramble = useTimerStore(store => store.scramble);
  const selectedCube = useTimerStore(store => store.selectedCube);
  const setNewScramble = useTimerStore(store => store.setNewScramble);
  const [engine, setEngine] = React.useState<CubeEngine | null>();
  const [moves, setMoves] = React.useState<string[]>();
  const [isSolved, setIsSolved] = React.useState(false);
  const [solvingTime, setSolvingTime] = React.useState<number | null>(null);
  const processedSolveRef = React.useRef(false);

  // Lock window after a solve to avoid key handling and cascaded saves
  const postSolveLockRef = React.useRef<number>(0);
  const postSolveTimeoutRef = React.useRef<number | null>(null);
  const isRunning = useTimerStore(store => store.isSolving);
  const setIsRunning = useTimerStore(store => store.setIsSolving);
  const { saveCube } = useNXData();
  const setSelectedCube = useTimerStore(store => store.setSelectedCube);
  const setLastSolve = useTimerStore(store => store.setLastSolve);
  const lastSolve = useTimerStore(store => store.lastSolve);
  const settings = useSettingsModalStore(state => state.settings)

  const saveSolvePlaceholder = (_payload: {
    timeMs: number;
    scramble: string | null;
    moves: string[];
    dnf: boolean
  }) => {
    if (!selectedCube || !scramble) return;

    const now = Date.now();
    const newSolve: Solve = {
      id: genId(),
      startTime: now - _payload.timeMs,
      endTime: Date.now(),
      scramble: scramble,
      bookmark: false,
      time: _payload.timeMs,
      dnf: _payload.dnf,
      plus2: false,
      rating: Math.floor(Math.random() * 20) + scramble.length,
      cubeId: selectedCube.id,
      comment: '',
    };

    const updatedCube = {
      ...selectedCube,
      solves: {
        ...selectedCube.solves,
        session: [newSolve, ...selectedCube.solves.session],
      },
    }

    saveCube(updatedCube);
    setSelectedCube(updatedCube);
    setLastSolve({ ...newSolve });
    // Do not request a new scramble here; it will be triggered after a 2s pause post-solve
  }

  const startTimeRef = React.useRef<number | null>(null);
  const intervalRef = React.useRef<number | null>(null);

  const startTimer = React.useCallback(() => {
    if (isRunning) return;
    // Clear any post-solve lock or pending timeout when starting a new attempt
    postSolveLockRef.current = 0;
    if (postSolveTimeoutRef.current != null) {
      window.clearTimeout(postSolveTimeoutRef.current);
      postSolveTimeoutRef.current = null;
    }
    processedSolveRef.current = false;
    setIsRunning(true);
    startTimeRef.current = Date.now();
    setSolvingTime(0);
    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current != null) {
        setSolvingTime(Date.now() - startTimeRef.current);
      }
    }, 10);
  }, [isRunning]);

  const stopTimer = React.useCallback(() => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    if (startTimeRef.current != null) {
      setSolvingTime(Date.now() - startTimeRef.current);
    }
    startTimeRef.current = null;
  }, []);

  const resetTimer = React.useCallback(() => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    startTimeRef.current = null;
    setSolvingTime(0);
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const engine = new CubeEngine();
    const player = new TwistyPlayer({
      puzzle: '3x3x3',
      controlPanel: 'none',
      tempoScale: 3,
      background: 'none',
    });

    setPlayer(player);
    setEngine(engine);

    player.style.width = '320px';
    player.style.height = '320px';

    containerRef.current.appendChild(player);

    return () => {
      try {
        if (intervalRef.current != null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (postSolveTimeoutRef.current != null) {
          window.clearTimeout(postSolveTimeoutRef.current);
          postSolveTimeoutRef.current = null;
        }
        player.remove();
      } catch {
      }
    };
  }, []);

  React.useEffect(() => {
    if (!player || !engine) return;
    if (scramble) {
      player.experimentalSetupAlg = scramble;
      engine.reset();
      engine.applyMoves(scramble);
      setIsSolved(false);
      setMoves([]);
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
      startTimeRef.current = null;
    }
  }, [engine, player, scramble]);

  const recreateTwistyPlayer = React.useCallback(() => {
    if (!containerRef.current) return;
    try {
      if (player) {
        player.remove();
      }
    } catch {
    }
    const newPlayer = new TwistyPlayer({
      puzzle: '3x3x3',
      controlPanel: 'none',
      tempoScale: 3,
      background: 'none',
    });
    newPlayer.style.width = '320px';
    newPlayer.style.height = '320px';
    containerRef.current.appendChild(newPlayer);
    setPlayer(newPlayer);
  }, [player]);

  // Stop the timer when the cube is solved
  React.useEffect(() => {
    if (isSolved) {
      // Immediately stop the timer
      if (isRunning) {
        stopTimer();
      }
      // Guard against duplicate processing
      if (!processedSolveRef.current) {
        processedSolveRef.current = true;
        // Lock keyboard input for 2 seconds to avoid cascaded moves/saves
        const now = Date.now();
        postSolveLockRef.current = now + 2000;
        // Compute final time robustly
        const finalTime = startTimeRef.current != null
          ? (now - startTimeRef.current)
          : (solvingTime ?? 0);
        try {
          saveSolvePlaceholder({
            timeMs: finalTime,
            scramble: scramble ?? null,
            moves: moves ?? [],
            dnf: false,
          });
        } catch (e) {
          console.warn('saveSolvePlaceholder error (ignored):', e);
        }
        // After 2 seconds, generate next scramble and clear lock
        if (postSolveTimeoutRef.current != null) {
          window.clearTimeout(postSolveTimeoutRef.current);
        }
        postSolveTimeoutRef.current = window.setTimeout(() => {
          postSolveTimeoutRef.current = null;
          postSolveLockRef.current = 0;
          if (selectedCube) {
            setNewScramble(selectedCube);
          }
          try {
            recreateTwistyPlayer();
          } catch (e) {
            console.warn('recreateTwistyPlayer error (ignored):', e);
          }
        }, 2000);
      }
    }
  }, [isSolved, isRunning, stopTimer, solvingTime, scramble, moves, selectedCube, setNewScramble, recreateTwistyPlayer]);

  React.useEffect(() => {
    if (!player || !engine) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (!player || !engine || engine.isSolved()) return;
      // Ignore all input during post-solve lock period
      if (Date.now() < postSolveLockRef.current) return;

      // ESC cancels and resets
      if (e.key === 'Escape') {
        stopTimer();
        resetTimer();
        if (scramble) {
          player.experimentalSetupAlg = scramble;
          engine.reset();
          engine.applyMoves(scramble);
        } else {
          engine.reset();
        }
        setIsSolved(false);
        setMoves([]);
        return;
      }

      let didMove = false;

      if (e.key.toLowerCase() === 'h') {
        player.experimentalAddMove('F');
        engine.rotateF(true);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'j') {
        player.experimentalAddMove('U');
        engine.rotateU(true);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'k') {
        player.experimentalAddMove('R\'');
        engine.rotateR(false);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'l') {
        player.experimentalAddMove('D\'');
        engine.rotateD(false);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'y') {
        player.experimentalAddMove('x');
        engine.rotateX(true);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'u') {
        player.experimentalAddMove('Rw');
        engine.rotateRw(true);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'i') {
        player.experimentalAddMove('R');
        engine.rotateR(true);
        didMove = true;
      }
      if (e.key.toLowerCase() === 'o') {
        player.experimentalAddMove('B\'');
        engine.rotateB(false);
        didMove = true;
      }
      if (e.key.toLowerCase() === 'p') {
        player.experimentalAddMove('z');
        engine.rotateZ(true);
        didMove = true;
      }
      if (e.key.toLowerCase() === 'n') {
        player.experimentalAddMove('x\'');
        engine.rotateX(false);
        didMove = true;
      }
      if (e.key.toLowerCase() === 'm') {
        player.experimentalAddMove('Rw\'');
        engine.rotateRw(false);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'q') {
        player.experimentalAddMove('z\'');
        engine.rotateZ(false);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'w') {
        player.experimentalAddMove('B');
        engine.rotateB(true);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'e') {
        player.experimentalAddMove('L\'');
        engine.rotateL(false);
        didMove = true;
      }
      if (e.key.toLowerCase() === 'r') {
        player.experimentalAddMove('Lw\'');
        engine.rotateLw(false);
        didMove = true;
      }

      if (e.key.toLowerCase() === 't') {
        player.experimentalAddMove('x');
        engine.rotateX(true);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'a') {
        player.experimentalAddMove('y\'');
        engine.rotateY(false);
        didMove = true;
      }

      if (e.key.toLowerCase() === 's') {
        player.experimentalAddMove('D');
        engine.rotateD(true);
        didMove = true;
      }
      if (e.key.toLowerCase() === 'd') {
        player.experimentalAddMove('L');
        engine.rotateL(true);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'f') {
        player.experimentalAddMove('U\'');
        engine.rotateU(false);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'g') {
        player.experimentalAddMove('F\'');
        engine.rotateF(false);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'z') {
        player.experimentalAddMove('Dw');
        engine.rotateDw(true);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'x') {
        player.experimentalAddMove('M\'');
        engine.rotateM(false);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'c') {
        player.experimentalAddMove('Uw\'');
        engine.rotateUw(false);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'v') {
        player.experimentalAddMove('Lw');
        engine.rotateLw(true);
        didMove = true;
      }

      if (e.key.toLowerCase() === 'b') {
        player.experimentalAddMove('x\'');
        engine.rotateX(false);
        didMove = true;
      }

      if (didMove && !isRunning && !isSolved) {
        startTimer();
      }

      if (engine?.isSolved()) {
        console.log('Solved!');
        setIsSolved(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [engine, player, scramble, isRunning, isSolved, startTimer, resetTimer, stopTimer]);

  return (
    <div className={'grow flex justify-center items-center flex-col gap-4'}>
      <div ref={containerRef}/>
      <div className={'text-3xl'}>{formatTime(solvingTime || 0)}</div>
      {lastSolve &&
        settings.features.quickActionButtons &&
        !isRunning && (
          <MenuSolveOptions
            solve={lastSolve}
            onDeleteSolve={() => setLastSolve(null)}
            caseOfUse="last-solve"
            hideCopyButton
            hideMoveToHistory
            hideTransferCollection
          />
        )}
    </div>
  );
}
