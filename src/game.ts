import { TRPCError } from '@trpc/server'
import type {
  ActiveBoard,
  Board,
  BoardNum,
  Boards,
  CellNum,
  GameState,
  Move,
  Player,
  Reset,
  State,
} from './models'

export class Game {
  private state: State = { name: 'init' }
  private activeBoard: ActiveBoard = 'all'
  private boards: Boards
  private p1Id: number
  private p2Id: number

  constructor(rand: () => number) {
    this.boards = this.newBoards()
    this.p1Id = rand()
    this.p2Id = rand()
  }

  readonly register = () => {
    if (this.state.name === 'init') {
      this.state = { name: 'ready p1' }
      return { actor: 'p1', id: this.p1Id }
    }
    if (this.state.name === 'ready p1') {
      this.state = { name: 'turn', player: 'p1' }
      return { actor: 'p2', id: this.p2Id }
    }
    return { actor: 'spectator' }
  }

  readonly status = (): GameState => ({
    state: this.state,
    activeBoard: this.activeBoard,
    boards: this.boards,
  })

  readonly move = ({ boardNum, cellNum, playerId }: Move) => {
    if (this.state.name !== 'turn') {
      throw err("It's not time to take turns")
    }
    const thisPlayer = this.getPlayerFromId(playerId)
    if (thisPlayer === 'spectator') {
      throw err("Spectators can't play")
    }
    if (thisPlayer !== this.state.player) {
      throw err('Not your turn')
    }
    const mark = this.state.player === 'p1' ? 'X' : 'O'
    const boardIndx = this.activeBoard === 'all' ? boardNum : this.activeBoard
    const board = this.boards[boardIndx]
    const currentCell = board.cells[cellNum]
    if (currentCell !== 'E') {
      throw err('Bad move.  Cell is not empty!')
    }
    board.cells[cellNum] = mark
    if (boardIsWon(board, mark)) {
      board.status = mark
    }
    if (boardIsTie(board)) {
      board.status = 'tie'
    }
    const nextBoard = this.boards[cellNum]
    if (nextBoard.status !== 'available') {
      this.activeBoard = 'all'
    } else {
      this.activeBoard = cellNum
    }
    this.state = { name: 'turn', player: togglePlayers(thisPlayer) }
    if (gameIsWon(this.boards, mark)) {
      this.state = { name: 'win', player: thisPlayer }
    }
    if (gameIsTie(this.boards)) {
      this.state = { name: 'tie' }
    }
    return this.status()
  }

  readonly reset = ({ playerId }: Reset) => {
    const player = this.getPlayerFromId(playerId)
    if (['win', 'tie'].includes(this.state.name) && player === 'p1') {
      this.state = { name: 'reset p1' }
      return this.status()
    }
    if (this.state.name === 'reset p1' && player === 'p2') {
      this.activeBoard = 'all'
      const [one, two] = [this.p1Id, this.p2Id]
      this.p1Id = two
      this.p2Id = one
      this.boards = this.newBoards()
      this.state = { name: 'turn', player: 'p1' }
      return this.status()
    }
    throw err(`Bad reset call. State: ${this.state.name} Player: ${player}`)
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

  private getPlayerFromId(playerId: number): Player | 'spectator' {
    return playerId === this.p1Id ? 'p1' : playerId === this.p2Id ? 'p2' : 'spectator'
  }
}

const err = (message: string) =>
  new TRPCError({
    code: 'BAD_REQUEST',
    message,
  })

const boardIsWon = (board: Board, mark: 'X' | 'O'): boolean => {
  const cells = board.cells
  const hasMark = (a: CellNum) => cells[a] === mark
  const hasLine = (a: CellNum, b: CellNum, c: CellNum) =>
    hasMark(a) && hasMark(b) && hasMark(c)
  return (
    hasLine(0, 1, 2) ||
    hasLine(3, 4, 5) ||
    hasLine(6, 7, 8) ||
    hasLine(0, 3, 6) ||
    hasLine(1, 4, 7) ||
    hasLine(2, 5, 8) ||
    hasLine(0, 4, 8) ||
    hasLine(2, 4, 6)
  )
}

const boardIsTie = (board: Board): boolean => {
  const indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const
  return indexes.every((i) => board.cells[i] !== 'E')
}

const gameIsWon = (boards: Boards, mark: 'X' | 'O'): boolean => {
  const hasMark = (a: BoardNum) => boards[a].status === mark
  const hasLine = (a: BoardNum, b: BoardNum, c: BoardNum) =>
    hasMark(a) && hasMark(b) && hasMark(c)
  return (
    hasLine(0, 1, 2) ||
    hasLine(3, 4, 5) ||
    hasLine(6, 7, 8) ||
    hasLine(0, 3, 6) ||
    hasLine(1, 4, 7) ||
    hasLine(2, 5, 8) ||
    hasLine(0, 4, 8) ||
    hasLine(2, 4, 6)
  )
}

const gameIsTie = (boards: Boards): boolean => {
  const indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const
  return indexes.every((i) => boards[i].status !== 'available')
}

const togglePlayers = (player: Player): Player => (player === 'p1' ? 'p2' : 'p1')
