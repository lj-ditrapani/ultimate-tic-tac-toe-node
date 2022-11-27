import type { Board, BoardNum, Boards, GameState, State } from './models'

export class Game {
  private state: State = { name: 'init' }
  private activeBoard: BoardNum = 1
  boards: Boards
  private p1Id: number | undefined = undefined
  private p2Id: number | undefined = undefined

  constructor(private readonly rand: () => number) {
    this.boards = this.newBoards()
  }

  readonly register = () => {
    if (this.state.name === 'init') {
      this.state = { name: 'ready p1' }
      this.p1Id = this.rand()
      return { actor: 'p1', id: this.p1Id }
    }
    if (this.state.name === 'ready p1') {
      this.state = { name: '1st board' }
      this.p2Id = this.rand()
      return { actor: 'p2', id: this.p2Id }
    }
    return { actor: 'spectator' }
  }

  readonly status = (): GameState => ({
    state: this.state,
    activeBoard: this.activeBoard,
    boards: this.boards,
  })

  readonly firstBoard = (boardNum: BoardNum, playerId: number) => {
    if (this.state.name === '1st board' && playerId === this.p1Id) {
      this.state = { name: 'turn', player: 'p1' }
      this.activeBoard = boardNum
      return null
    } else {
      return ''
    }
  }

  readonly play = (_: {}) => {
    return ''
  }

  private newBoards(): Boards {
    return [
      this.newBoard(),
      this.newBoard(),
      this.newBoard(),
      this.newBoard(),
      this.newBoard(),
      this.newBoard(),
      this.newBoard(),
      this.newBoard(),
      this.newBoard(),
    ]
  }

  private newBoard(): Board {
    return {
      status: 'available',
      cells: ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    }
  }
}
