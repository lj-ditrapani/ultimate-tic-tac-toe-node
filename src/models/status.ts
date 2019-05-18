import WebSocket from 'ws'
import { GameState } from './game_state'

type ActiveBoard = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'A'

class Init {
  public readonly statusType: 'init' = 'init'
}

export const init = new Init()

export class ReadyPlayer1 {
  public readonly statusType: 'readyPlayer1' = 'readyPlayer1'

  constructor(public readonly player1: WebSocket) {}
}

export class Turn {
  public readonly statusType: 'turn' = 'turn'

  constructor(
    public readonly gameState: GameState,
    public readonly activePlayer: 1 | 2,
    public readonly activeBoard: ActiveBoard
  ) {}
}

export class GameOver {
  public readonly statusType: 'gameOver' = 'gameOver'

  constructor(
    public readonly gameState: GameState,
    public readonly winner: 1 | 2 | 'T'
  ) {}
}

export class Reset {
  public readonly statusType: 'reset' = 'reset'

  constructor(public readonly gameState: GameState, public readonly resetPlayr: 1 | 2) {}
}

export type Status = Init | ReadyPlayer1 | Turn | GameOver | Reset
