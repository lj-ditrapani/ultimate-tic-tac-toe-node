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
      for (const spectator of this.spectators) {
        sendStatus(spectator, status)
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

export const sendStatus = (ws: WebSocket, status: Status): void => {
  ws.send(status.toString())
}
