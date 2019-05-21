type Cell = 'empty' | 'player1' | 'player2'

type BoardStatus = 'available' | 'player1Won' | 'player2Won' | 'tie'

export class LocalBoard {
  constructor(public readonly status: BoardStatus, public readonly cells: Cell[]) {}
}

type ActiveBoard = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'all'

class Init {
  public readonly statusType: 'init' = 'init'
}

export const init = new Init()

class ReadyPlayer1 {
  public readonly statusType: 'readyPlayer1' = 'readyPlayer1'
}

export const readyPlayer1 = new ReadyPlayer1()

export class Turn {
  public readonly statusType: 'turn' = 'turn'

  constructor(
    public readonly globalBoard: LocalBoard[],
    public readonly activePlayer: 'me' | 'other',
    public readonly activeBoard: ActiveBoard
  ) {}
}

export class GameOver {
  public readonly statusType: 'gameOver' = 'gameOver'

  constructor(
    public readonly globalBoard: LocalBoard[],
    public readonly winner: 'me' | 'other' | 'T'
  ) {}
}

export class Reset {
  public readonly statusType: 'reset' = 'reset'

  constructor(
    public readonly globalBoard: LocalBoard[],
    public readonly resetPlayer: 'me' | 'other'
  ) {}
}

export type Status = Init | ReadyPlayer1 | Turn | GameOver | Reset
