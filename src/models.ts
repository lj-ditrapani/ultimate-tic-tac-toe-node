type ActiveBoard = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'A'

class Player {
  constructor(
    public readonly ws: WebSocket
  ) {}
}

type Cell = 'empty' | 'player1' | 'player2'

type BoardStatus = 'available' | 'player1Won' | 'player2Won' | 'tie'

class LocalBoard {
  constructor(public readonly status: BoardStatus, public readonly cells: Cell[]) {}
}

class GlobalBoard {
  constructor(public readonly localBoards: LocalBoard[]) {}
}

class GameState {
  constructor(
    public readonly player1: Player,
    public readonly player2: Player,
    public readonly globalBoard: GlobalBoard
  ) {}
}

class Init {
  public readonly status: 'init' = 'init'
}

export const init = new Init()

export class ReadyPlayer1 {
  public readonly status: 'readyPlayer1' = 'readyPlayer1'

  constructor(
    public readonly player1: Player
  ) {}
}

export class Turn {
  public readonly status: 'turn' = 'turn'
  
  constructor(
    public readonly gameState: GameState,
    public readonly activePlayer: 1 | 2,
    public readonly activeBoard: ActiveBoard
  ) {}
}

export class GameOver {
  public readonly status: 'gameOver' = 'gameOver'
  
  constructor(
    public readonly gameState: GameState,
    public readonly winner: 1 | 2 | 'T',
  ) {}
}

export class Reset {
  public readonly status: 'reset' = 'reset'

  constructor(
    public readonly gameState: GameState,
    public readonly resetPlayr: 1 | 2
  ){}
}

export type Status = Init | ReadyPlayer1 | Turn | GameOver | Reset
