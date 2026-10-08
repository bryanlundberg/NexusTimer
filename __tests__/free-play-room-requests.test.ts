import { emitRealtime, setRealtimeSender } from '@/features/realtime/model/realtime-bus'
import { nextRid, requestRoom } from '@/features/free-play-room/model/room-requests'

describe('requestRoom', () => {
  afterEach(() => setRealtimeSender(null))

  it('resolves with the reply that carries the same rid', async () => {
    const sent: string[] = []
    setRealtimeSender((data) => sent.push(data))
    const rid = nextRid()

    const reply = requestRoom({
      type: 'room:create',
      rid,
      name: 'Sala',
      event: '3x3',
      maxRoundTime: 60,
      private: false
    })
    emitRealtime({ type: 'room:created', rid: rid + 1, roomId: 'not-mine' })
    emitRealtime({ type: 'room:created', rid, roomId: 'abc12345' })

    await expect(reply).resolves.toEqual({ type: 'room:created', rid, roomId: 'abc12345' })
    expect(JSON.parse(sent[0]!)).toMatchObject({ type: 'room:create', rid })
  })

  it('resolves with a room:error for that rid too', async () => {
    setRealtimeSender(() => {})
    const rid = nextRid()

    const reply = requestRoom({ type: 'room:join', rid, roomId: 'x', code: 'AAAAAA', protocol: 1 })
    emitRealtime({ type: 'room:error', rid, roomId: 'x', code: 'wrong-code' })

    await expect(reply).resolves.toMatchObject({ type: 'room:error', code: 'wrong-code' })
  })

  it('rejects at once when the socket is not connected', async () => {
    await expect(requestRoom({ type: 'rooms:watch', rid: nextRid() })).rejects.toThrow('not connected')
  })

  it('rejects when nothing answers in time', async () => {
    vi.useFakeTimers()
    setRealtimeSender(() => {})

    const reply = requestRoom({ type: 'rooms:watch', rid: nextRid() }, 1_000)
    vi.advanceTimersByTime(1_000)

    await expect(reply).rejects.toThrow('timed out')
    vi.useRealTimers()
  })
})
