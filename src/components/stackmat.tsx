'use client'
import { Solve } from '@/interfaces/Solve'
import genId from '@/lib/genId'
import { useTimerStore } from '@/store/timerStore'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { TimerStatus } from '@/enums/TimerStatus'
import { useNXData } from '@/hooks/useNXData'
import { useSettingsModalStore } from '@/store/SettingsModalStore'

// Minimal Packet shape used in this component to avoid static type import
// which can cause build resolution errors with Turbopack.
type PacketLike = { timeInMilliseconds: number }

export default function Stackmat() {
  const { getAllCubes, getCubeById, saveCube } = useNXData()
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const cubes = useTimerStore((state) => state.cubes)
  const setCubes = useTimerStore((state) => state.setCubes)
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
    let controller: any
    let cancelled = false
    ;(async () => {
      try {
        const mod: any = await import('stackmat')
        if (cancelled) return
        const StackmatController = mod?.Stackmat ?? mod?.default ?? mod
        controller = new StackmatController()
        setStackmat(controller)
      } catch (err) {
        console.error('Failed to load stackmat module:', err)
        toast('No se pudo cargar el controlador Stackmat en este navegador.')
      }
    })()
    return () => {
      cancelled = true
      try {
        controller?.stop?.()
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (stackmat) {
      let startTime: any = null
      const onStarted = (packet: PacketLike) => {
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
      const onReset = async (packet: PacketLike) => {
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

      const onConnected = (_packet: PacketLike) => {
        toast('Device connected')
      }
      const onDisconnected = (_packet: PacketLike) => {
        toast('Device disconnected')
      }

      stackmat.on('started', onStarted)
      stackmat.on('reset', onReset)
      stackmat.on('timerConnected', onConnected)
      stackmat.on('timerDisconnected', onDisconnected)

      /*
        EXPERIMENTAL SECTION
        ---------------------
        The following event is experimental and has not been tested.
        It was implemented based on the standard controller library's documentation
        to handle potential edge cases where events might be missing for certain users.

        Event:
        - "stopped": This event is expected to trigger when the timer stops.
      */

      stackmat.on('stopped', onReset)

      return () => {
        stackmat.off('started', onStarted)
        stackmat.off('reset', onReset)
        stackmat.off('timerConnected', onConnected)
        stackmat.off('timerDisconnected', onDisconnected)
        stackmat.off('stopped', onReset)
      }
    }
  }, [
    stackmat,
    setIsSolving,
    setSolvingTime,
    setTimerStatus,
    selectedCube,
    scramble,
    cubes,
    setCubes,
    setSelectedCube,
    setLastSolve,
    setNewScramble,
    timerStatus,
    getAllCubes,
    getCubeById,
    saveCube,
    updateSetting,
    solvesSinceLastSync
  ])

  useEffect(() => {
    if (stackmat) {
      stackmat.start()
    }
  }, [stackmat])

  return null
}
