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
    this.status = status
  }

  public getStatus(): Status {
    return this.status
  }

  public addSpectator(spectator: WebSocket): void {
    this.spectators.push(spectator)
  }
}
