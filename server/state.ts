import WebSocket from 'ws'
import { init, Status } from './models/status'

export interface IState {
  update(status: Status): void
  getStatus(): Status
  addSpectator(spectator: WebSocket): void
}

export class State implements IState {
  private status: Status = init
  private readonly spectators: WebSocket[] = []

  public update(status: Status): void {
    if (status !== this.status) {
      this.status = status
      switch (status.statusType) {
        case 'init':
          break
        case 'readyPlayer1':
          sendStatus(status.player1, '1', status)
          break
        case 'turn':
        case 'gameOver':
        case 'reset':
          const gameState = status.gameState
          sendStatus(gameState.player1, '1', status)
          sendStatus(gameState.player2, '2', status)
          break
        default:
          const exhaustiveCheck: never = status
          throw new Error(exhaustiveCheck)
      }
      for (const spectator of this.spectators) {
        sendStatus(spectator, 'S', status)
      }
    }
  }

  public getStatus(): Status {
    return this.status
  }

  public addSpectator(spectator: WebSocket): void {
    this.spectators.push(spectator)
  }
}

type Entity = '1' | '2' | 'S'

export const sendStatus = (ws: WebSocket, entity: Entity, status: Status): void => {
  ws.send(entity + status.toString())
}
