import { useEffect, useRef, useState } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useScreenWakeLock } from '@/shared/model/useScreenWakeLock'
import { TimerStatus } from '@/features/timer/model/enums'
import { Solve } from '@/entities/solve/model/types'
import genId from '@/shared/lib/genId'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { child, onDisconnect, onValue, ref, update } from '@firebase/database'
import { rtdb } from '@/shared/config/firebase'
import { useNexusConnectStore } from '@/features/nexus-connect/model/useNexusConnectStore'
import { UAParser } from 'ua-parser-js'

export default function NXConnect() {
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const setNewScramble = useTimerStore((state) => state.setNewScramble)
  const setLastSolve = useTimerStore((state) => state.setLastSolve)
  const setSolvingTime = useTimerStore((state) => state.setSolvingTime)
  const setIsSolving = useTimerStore((state) => state.setIsSolving)
  const timerStatus = useTimerStore((state) => state.timerStatus)
  const setTimerStatus = useTimerStore((state) => state.setTimerStatus)
  const scramble = useTimerStore((state) => state.scramble)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const solvesSinceLastSync = useSettingsStore((state) => state.settings.sync.totalSolves)
  const nexusConnectId = useNexusConnectStore((state) => state.nexusConnectId)
  const isSolving = useTimerStore((state) => state.isSolving)
  const [connectSessionData, setConnectSessionData] = useState<any>(null)
  const startSolveTime = useRef<number | null>(null)
  const solveTimeId = useRef<any>(null)
  const serverOffset = useRef(0)

  const stopLocalTimer = () => {
    if (solveTimeId.current) {
      cancelAnimationFrame(solveTimeId.current)
      solveTimeId.current = null
    }
    startSolveTime.current = null
  }

  const startLocalTimer = (startAt: number) => {
    stopLocalTimer()
    startSolveTime.current = startAt

    const updateTimer = () => {
      if (startSolveTime.current === null) return

      const now = Date.now() + serverOffset.current
      const difference = now - startSolveTime.current

      setSolvingTime(difference)
      solveTimeId.current = requestAnimationFrame(updateTimer)
    }

    solveTimeId.current = requestAnimationFrame(updateTimer)
  }

  useScreenWakeLock(isSolving || timerStatus === TimerStatus.INSPECTING)

  useEffect(() => {
    const offsetRef = ref(rtdb, '.info/serverTimeOffset')
    onValue(offsetRef, (snap) => {
      serverOffset.current = snap.val() || 0
    })
  }, [])

  useEffect(() => {
    if (!nexusConnectId) return
    const connectionRef = ref(rtdb, `connect-sessions/${nexusConnectId}`)
    onValue(connectionRef, (snapshot) => {
      const data = snapshot.val()
      setConnectSessionData(data)
    })
  }, [nexusConnectId])

  useEffect(() => {
    return () => {
      stopLocalTimer()
    }
  }, [])

  useEffect(() => {
    if (!connectSessionData) return

    const { isSolving: sessionIsSolving, elapsedTime, startAt } = connectSessionData

    if (sessionIsSolving && !isSolving) {
      setIsSolving(true)
      setTimerStatus(TimerStatus.SOLVING)
      startLocalTimer(startAt)
    }

    if (!sessionIsSolving && isSolving) {
      stopLocalTimer()
      setIsSolving(false)
      setTimerStatus(TimerStatus.IDLE)

      if (!selectedCube || !scramble) return

      setSolvingTime(elapsedTime)

      const newSolve: Solve = {
        id: genId(),
        startTime: startAt || Date.now() - elapsedTime,
        endTime: Date.now(),
        scramble: scramble,
        bookmark: false,
        time: elapsedTime,
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

      cubesDB.update(updatedCube).then(() => {
        setSelectedCube(updatedCube)
        setLastSolve({ ...newSolve })
        setNewScramble(selectedCube)
        updateSetting('sync.totalSolves', 1 + solvesSinceLastSync)
      })
    }
  }, [connectSessionData, isSolving, selectedCube, scramble, solvesSinceLastSync])

  useEffect(() => {
    if (!nexusConnectId) return

    const parser = new UAParser(navigator.userAgent)

    const os = parser.getOS()
    const browser = parser.getBrowser()

    const connectionRef = ref(rtdb, 'connect-sessions/' + nexusConnectId)

    const disconnectRef = onDisconnect(connectionRef)
    disconnectRef.update({
      primary: null,
      isSolving: false,
      updatedAt: Date.now()
    })

    ;(async () => {
      await update(connectionRef, {
        primary: {
          os: {
            name: os.name || 'Unknown',
            version: os.version || 'Unknown'
          },
          browser: {
            name: browser.name || 'Unknown',
            version: browser.version || 'Unknown'
          }
        },
        isSolving: false,
        startAt: null,
        elapsedTime: 0,
        secondary: null,
        updatedAt: Date.now()
      })
    })()
  }, [nexusConnectId])

  return null
}
