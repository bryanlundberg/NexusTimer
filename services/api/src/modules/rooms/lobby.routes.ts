import type { RoomSummary } from '@nexustimer/contracts'
import { Hono } from 'hono'
import { ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import type { RoomLobby } from './lobby.store'

/** The free play lobby for visitors without a session; signed-in players get it live over the socket. */
export function lobbyRoutes(lobby: RoomLobby) {
  return new Hono<AppEnv>().get('/', async () => {
    try {
      return ok<RoomSummary[]>(await lobby.list())
    } catch (error) {
      return serverError('rooms:GET', error)
    }
  })
}
