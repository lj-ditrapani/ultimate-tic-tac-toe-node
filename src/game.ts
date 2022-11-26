import WebSocket, { Server } from 'ws'
import { Event, NewStatus, spectatorJoined } from './models/event'
import { initialTurn, ReadyPlayer1, Status } from './models/status'
import { NextStatus } from './next_status'
import { sendStatus, State } from './state'

export class Game {
  constructor(
    private readonly wss: Server,
    private readonly state: State,
    private readonly interpretConn: InterpretConnection,
    private readonly messageHandler: MessageHandler,
  ) {}

  public listen() {
    this.wss.on('connection', (ws) => {
      const event = this.interpretConn(ws, this.state.getStatus())
      switch (event.eventType) {
        case 'spectatorJoined':
          this.state.addSpectator(ws)
          sendStatus(ws, 'S', this.state.getStatus())
          break
        case 'newStatus':
          ws.on('message', this.messageHandler)
          this.state.update(event.status)
          break
        default:
          const exhaustiveCheck: never = event
          throw new Error(exhaustiveCheck)
      }
    })
  }
}

type InterpretConnection = (ws: WebSocket, status: Status) => Event

export const interpretConnection = (ws: WebSocket, status: Status): Event => {
  switch (status.statusType) {
    case 'init':
      return new NewStatus(new ReadyPlayer1(ws))
    case 'readyPlayer1':
      return new NewStatus(initialTurn(status.player1, ws))
    default:
      return spectatorJoined
  }
}

export type MessageHandler = (ws: WebSocket, message: string) => void

export const messageHandlerFactory =
  (state: State, computeNextStatus: NextStatus): MessageHandler =>
  (ws: WebSocket, message: string): void => {
    const newStatus = computeNextStatus(message, ws, state.getStatus())
    state.update(newStatus)
  }
