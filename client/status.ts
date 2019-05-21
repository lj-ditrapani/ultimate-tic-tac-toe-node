export type Cell = 'empty' | 'player1' | 'player2'

type BoardStatus = 'available' | 'player1Won' | 'player2Won' | 'tie'

export class LocalBoard {
  constructor(public readonly status: BoardStatus, public readonly cells: Cell[]) {}
}

type ActiveBoard = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'all'

type StatusType = 'init' | 'readyPlayer1' | 'turn' | 'gameOver' | 'reset'

abstract class BaseStatus {
  public abstract readonly statusType: StatusType

  constructor(
    public readonly globalBoard: LocalBoard[],
    public readonly activeBoard: ActiveBoard
  ) {}
}

export class Init extends BaseStatus {
  public readonly statusType: 'init' = 'init'

  constructor(globalBoard: LocalBoard[], activeBoard: ActiveBoard) {
    super(globalBoard, activeBoard)
  }
}

export class ReadyPlayer1 extends BaseStatus {
  public readonly statusType: 'readyPlayer1' = 'readyPlayer1'

  constructor(globalBoard: LocalBoard[], activeBoard: ActiveBoard) {
    super(globalBoard, activeBoard)
  }
}

export class Turn extends BaseStatus {
  public readonly statusType: 'turn' = 'turn'

  constructor(
    globalBoard: LocalBoard[],
    activeBoard: ActiveBoard,
    public readonly activePlayer: 'me' | 'other'
  ) {
    super(globalBoard, activeBoard)
  }
}

export class GameOver extends BaseStatus {
  public readonly statusType: 'gameOver' = 'gameOver'

  constructor(
    globalBoard: LocalBoard[],
    activeBoard: ActiveBoard,
    public readonly winner: 'me' | 'other' | 'T'
  ) {
    super(globalBoard, activeBoard)
  }
}

export class Reset extends BaseStatus {
  public readonly statusType: 'reset' = 'reset'

  constructor(
    globalBoard: LocalBoard[],
    activeBoard: ActiveBoard,
    public readonly resetPlayer: 'me' | 'other'
  ) {
    super(globalBoard, activeBoard)
  }
}

export type Status = Init | ReadyPlayer1 | Turn | GameOver | Reset
