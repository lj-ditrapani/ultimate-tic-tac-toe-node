import { Status } from './status'

class SpectatorJoined {
  public readonly eventType = 'spectatorJoined'
}

export const spectatorJoined = new SpectatorJoined()

export class NewStatus {
  public readonly eventType = 'newStatus'

  constructor(public readonly status: Status) {}
}

export type Event = SpectatorJoined | NewStatus
