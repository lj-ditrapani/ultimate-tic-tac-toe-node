import WebSocket from 'ws'

type Cell = 'empty' | 'player1' | 'player2'

type BoardStatus = 'available' | 'player1Won' | 'player2Won' | 'tie'

class LocalBoard {
  constructor(public readonly status: BoardStatus, public readonly cells: Cell[]) {}
}

export class GameState {
  constructor(
    public readonly player1: WebSocket,
    public readonly player2: WebSocket,
    public readonly globalBoard: LocalBoard[]
  ) {}
}

const emptyCell: 'empty' = 'empty'
const emptyLocalBoard: LocalBoard = new LocalBoard(
  'available',
  Array.from(Array(9).keys()).map(_ => emptyCell)
)

export const emptyGlobalBoard: LocalBoard[] = Array.from(Array(9).keys()).map(
  _ => emptyLocalBoard
)
