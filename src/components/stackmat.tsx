'use client'
import { Solve } from '@/interfaces/Solve'
import genId from '@/lib/genId'
import { useTimerStore } from '@/store/timerStore'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { TimerStatus } from '@/enums/TimerStatus'
import { useNXData } from '@/hooks/useNXData'
import { useSettingsModalStore } from '@/store/SettingsModalStore'
import { Packet, Stackmat as StackmatController } from 'stackmat-v2'

export default function Stackmat() {
  const { saveCube } = useNXData()
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const cubes = useTimerStore((state) => state.cubes)
  const setNewScramble = useTimerStore((state) => state.setNewScramble)
  const setLastSolve = useTimerStore((state) => state.setLastSolve)
  const setSolvingTime = useTimerStore((state) => state.setSolvingTime)
  const setIsSolving = useTimerStore((state) => state.setIsSolving)
  const timerStatus = useTimerStore((state) => state.timerStatus)
  const setTimerStatus = useTimerStore((state) => state.setTimerStatus)
  const scramble = useTimerStore((state) => state.scramble)
  const updateSetting = useSettingsModalStore((state) => state.updateSetting)
  const solvesSinceLastSync = useSettingsModalStore((state) => state.settings.sync.totalSolves)
  const [stackmat, setStackmat] = useState<any>(null)
  const solvingIdRef = useRef<any>(null)

  useEffect(() => {
    const controller = new StackmatController()
    setStackmat(controller)

    return () => {
      try {
        controller?.stop?.()
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (stackmat) {
      let startTime: any = null
      const onStarted = (packet: Packet) => {
        if (!selectedCube || !scramble) {
          return
        }

        setIsSolving(true)
        setTimerStatus(TimerStatus.SOLVING)
        startTime = Date.now()

        if (!solvingIdRef.current) {
          solvingIdRef.current = setInterval(() => {
            setSolvingTime(Date.now() - startTime)
          }, 100)
        }
      }
      const onReset = async (packet: Packet) => {
        if (!solvingIdRef.current || !selectedCube || !scramble) return
        clearInterval(solvingIdRef.current)
        solvingIdRef.current = null

        setSolvingTime(packet.timeInMilliseconds)
        setIsSolving(false)
        setTimerStatus(TimerStatus.IDLE)
        const newSolve: Solve = {
          id: genId(),
          startTime: Date.now() - packet.timeInMilliseconds,
          endTime: Date.now(),
          scramble: scramble,
          bookmark: false,
          time: packet.timeInMilliseconds,
          dnf: false,
          plus2: false,
          rating: Math.floor(Math.random() * 20) + scramble.length,
          cubeId: selectedCube.id,
          comment: '',
          updatedAt: Date.now(),
          isDeleted: false
        }

        const updatedCube = {
          ...selectedCube,
          solves: {
            ...selectedCube.solves,
            session: [newSolve, ...selectedCube.solves.session]
          }
        }

        saveCube(updatedCube)
        setSelectedCube(updatedCube)
        setLastSolve({ ...newSolve })
        setNewScramble(selectedCube)
        updateSetting('sync.totalSolves', 1 + solvesSinceLastSync)
      }

      const onConnected = (_packet: Packet) => {
        toast('Device connected')
      }
      const onDisconnected = (_packet: Packet) => {
        toast('Device disconnected')
      }

      stackmat.on('started', onStarted)
      stackmat.on('reset', onReset)
      stackmat.on('timerConnected', onConnected)
      stackmat.on('timerDisconnected', onDisconnected)
      stackmat.on('stopped', onReset)

      return () => {
        stackmat.off('started', onStarted)
        stackmat.off('reset', onReset)
        stackmat.off('timerConnected', onConnected)
        stackmat.off('timerDisconnected', onDisconnected)
        stackmat.off('stopped', onReset)
      }
    }
  }, [stackmat, selectedCube, scramble, cubes, timerStatus, solvesSinceLastSync])

  useEffect(() => {
    if (stackmat) {
      stackmat.start()
    }
  }, [stackmat])

  return null
}
