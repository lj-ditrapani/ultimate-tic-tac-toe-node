import WebSocket from 'ws'
import { Status } from './status'

export class SpectatorJoined {
  public readonly eventType = 'spectatorJoined'

  constructor(public readonly spectator: WebSocket) {}
}

export class NewStatus {
  public readonly eventType = 'newStatus'

  constructor(public readonly status: Status, public readonly ws: WebSocket) {}
}

export type Event = SpectatorJoined | NewStatus
