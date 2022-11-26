import type { State } from './models'

export class Game {
  private state: State = { name: 'init' }
  private p1Id: number | undefined = undefined
  private p2Id: number | undefined = undefined

  constructor(private readonly rand: () => number) {}

  readonly register = () => {
    if (this.state.name === 'init') {
      this.state = { name: 'ready p1' }
      this.p1Id = this.rand()
      return { actor: 'p1', id: this.p1Id }
    }
    if (this.state.name === 'ready p1') {
      this.state = { name: 'turn', player: 'p1' }
      this.p2Id = this.rand()
      return { actor: 'p2', id: this.p2Id }
    }
    return { actor: 'spectator' }
  }
}
