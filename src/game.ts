import WebSocket, { Server } from 'ws'
import { Event, NewStatus, SpectatorJoined } from './models/event'
import { initialTurn, ReadyPlayer1, Status } from './models/status'
import { State } from './state'

export class Game {
  constructor(
    private readonly wss: Server,
    private readonly state: State,
    private readonly connHandler: ConnectionHandler,
    private readonly impureMessageHandler: ImpureMessageHandler
  ) {}

  public listen() {
    this.wss.on('connection', ws => {
      const event = this.connHandler(ws, this.state.getStatus())
      switch (event.eventType) {
        case 'spectatorJoined':
          this.state.addSpectator(event.spectator)
          break
        case 'newStatus':
          event.ws.on('message', this.impureMessageHandler)
          this.state.update(event.status)
          break
        default:
          const exhaustiveCheck: never = event
          throw new Error(exhaustiveCheck)
      }
    })
  }
}

type ConnectionHandler = (ws: WebSocket, status: Status) => Event

export const connectionHandler = (ws: WebSocket, status: Status): Event => {
  switch (status.statusType) {
    case 'init':
      return new NewStatus(new ReadyPlayer1(ws), ws)
    case 'readyPlayer1':
      return new NewStatus(initialTurn(status.player1, ws), ws)
    default:
      return new SpectatorJoined(ws)
  }
}

export type ImpureMessageHandler = (ws: WebSocket, message: string) => void

export const impureMessageHandlerFactory = (
  state: State,
  mesgHandler: PureMessageHandler
): ImpureMessageHandler => (ws: WebSocket, message: string): void => {
  const newStatus = mesgHandler(message, ws, state.getStatus())
  state.update(newStatus)
}

export type PureMessageHandler = (
  message: string,
  ws: WebSocket,
  status: Status
) => Status

export const messageHandler: PureMessageHandler = (
  message: string,
  ws: WebSocket,
  status: Status
): Status => {
  switch (status.statusType) {
    case 'turn':
      const gameState = status.gameState
      const activePlayer =
        status.activePlayer === 'player1' ? gameState.player1 : gameState.player2
      if (ws === activePlayer) {
        return handleTurn(message, status)
      } else {
        return status
      }
    case 'gameOver':
      return status
    case 'reset':
      return status
    default:
      return status
  }
}

export const handleTurn = (message: string, status: Status): Status => {
  if (message === 'hi') {
    return status
  } else {
    return status
  }
}
