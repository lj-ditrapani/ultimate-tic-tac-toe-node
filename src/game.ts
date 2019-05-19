import WebSocket, { Server } from 'ws'
import { Event, NewStatus, SpectatorJoined } from './models/event'
import { init, initialTurn, ReadyPlayer1, Status } from './models/status'

export class Game {
  public status: Status = init
  public readonly spectators: WebSocket[] = []

  constructor(
    private readonly wss: Server,
    private readonly connectionHandler: IConnectionHandler
  ) {}

  public listen() {
    this.wss.on('connection', ws => {
      const originalStatus = this.status
      const event = this.connectionHandler.handle(ws, this.status)
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
        sendStatus(spectator, this.status)
      }
    }
  }
}

export const sendStatus = (ws: WebSocket, status: Status): void => {
  ws.send(status.toString())
}

interface IConnectionHandler {
  handle(ws: WebSocket, status: Status): Event
}

export class ConnectionHandler implements IConnectionHandler {
  constructor(private readonly mesgHandler: MessageHandler) {}

  public handle(ws: WebSocket, status: Status): Event {
    switch (status.statusType) {
      case 'init':
        ws.on('message', (thisWs: WebSocket, message: string) => {
          const newStatus = this.mesgHandler(message, thisWs, status)
          console.log(newStatus)
        })
        return new NewStatus(new ReadyPlayer1(ws))
      case 'readyPlayer1':
        return new NewStatus(initialTurn(status.player1, ws))
      default:
        return new SpectatorJoined(ws)
    }
  }
}

export type MessageHandler = (message: string, ws: WebSocket, status: Status) => Status

export const messageHandler: MessageHandler = (
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
