export type Cell = 'empty' | 'player1' | 'player2'

export type BoardStatus = 'available' | 'player1Won' | 'player2Won' | 'tie'

export class LocalBoard {
  constructor(public readonly status: BoardStatus, public readonly cells: Cell[]) {}
}

export type ActiveBoard = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'all'
