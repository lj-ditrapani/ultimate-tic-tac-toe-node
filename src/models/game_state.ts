import WebSocket from 'ws'

type Cell = 'empty' | 'player1' | 'player2'

type BoardStatus = 'available' | 'player1Won' | 'player2Won' | 'tie'

const boardStatus2Char = (boardStatus: BoardStatus): string => {
  switch (boardStatus) {
    case 'available':
      return 'A'
    case 'player1Won':
      return '1'
    case 'player2Won':
      return '2'
    case 'tie':
      return 'T'
    default:
      const exhaustiveCheck: never = boardStatus
      return exhaustiveCheck
  }
}

const cell2Char = (cell: Cell): string => {
  switch (cell) {
    case 'empty':
      return 'E'
    case 'player1':
      return '1'
    case 'player2':
      return '2'
    default:
      const exhaustiveCheck: never = cell
      return exhaustiveCheck
  }
}

export class LocalBoard {
  constructor(public readonly status: BoardStatus, public readonly cells: Cell[]) {}

  public toString() {
    return (
      boardStatus2Char(this.status) + this.cells.map((cell) => cell2Char(cell)).join('')
    )
  }
}

export class GameState {
  constructor(
    public readonly player1: WebSocket,
    public readonly player2: WebSocket,
    public readonly globalBoard: LocalBoard[],
  ) {}

  public toString() {
    return globalBoardToString(this.globalBoard)
  }
}

const emptyCell: 'empty' = 'empty'
const emptyLocalBoard: LocalBoard = new LocalBoard(
  'available',
  Array.from(Array(9).keys()).map((_) => emptyCell),
)

export const emptyGlobalBoard: LocalBoard[] = Array.from(Array(9).keys()).map(
  (_) => emptyLocalBoard,
)

export const globalBoardToString = (globalBoard: LocalBoard[]): string =>
  globalBoard.map((board) => board.toString()).join('\n')

export const emptyGlobalBoardString = globalBoardToString(emptyGlobalBoard)
