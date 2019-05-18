import WebSocket, { Server } from 'ws'
import { Event, NewStatus, SpectatorJoined } from './models/event'
import { init, ReadyPlayer1, Status } from './models/status'

export class Game {
  public status: Status = init
  public readonly spectators: WebSocket[] = []

  constructor(
    private readonly wss: Server,
    private readonly connHandler: ConnectionHandler
  ) {}

  public listen() {
    this.wss.on('connection', ws => {
      const originalStatus = this.status
      const event = this.connHandler(ws, this.status)
      switch (event.eventType) {
        case 'spectatorJoined':
          this.spectators.push(event.spectator)
          break
        case 'newStatus':
          this.status = event.status
          break
        default:
          const exhaustiveCheck: never = event
          throw new Error(exhaustiveCheck)
      }
      this.update(originalStatus)
    })
  }

  private update(originalStatus: Status): void {
    if (originalStatus !== this.status) {
      for (const spectator of this.spectators) {
        spectator.send('new state here')
      }
    }
  }
}

export type ConnectionHandler = (ws: WebSocket, status: Status) => Event

export const connectionHandler: ConnectionHandler = (
  ws: WebSocket,
  status: Status
): Event => {
  switch (status.statusType) {
    case 'init':
      return new NewStatus(new ReadyPlayer1(ws))
    /*
    case 'readyPlayer1';
      return new NewStatus(initialTurn(status.player1, ws))
      */
    default:
      return new SpectatorJoined(ws)
  }
}
