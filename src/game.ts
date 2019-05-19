import WebSocket, { Server } from 'ws'
import { Event, NewStatus, SpectatorJoined } from './models/event'
import { initialTurn, ReadyPlayer1, Status } from './models/status'
import { State } from './state'

export class Game {
  constructor(
    private readonly wss: Server,
    private readonly state: State,
    private readonly connectionHandler: IConnectionHandler
  ) {}

  public listen() {
    this.wss.on('connection', ws => {
      const event = this.connectionHandler.handle(ws, this.state.getStatus())
      switch (event.eventType) {
        case 'spectatorJoined':
          this.state.addSpectator(event.spectator)
          break
        case 'newStatus':
          this.state.update(event.status)
          break
        default:
          const exhaustiveCheck: never = event
          throw new Error(exhaustiveCheck)
      }
    })
  }
}

interface IConnectionHandler {
  handle(ws: WebSocket, status: Status): Event
}

export class ConnectionHandler implements IConnectionHandler {
  constructor(private readonly impureMessageHandler: ImpureMessageHandler) {}

  public handle(ws: WebSocket, status: Status): Event {
    switch (status.statusType) {
      case 'init':
        ws.on('message', this.impureMessageHandler)
        return new NewStatus(new ReadyPlayer1(ws))
      case 'readyPlayer1':
        ws.on('message', this.impureMessageHandler)
        return new NewStatus(initialTurn(status.player1, ws))
      default:
        return new SpectatorJoined(ws)
    }
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
