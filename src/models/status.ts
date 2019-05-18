import WebSocket from 'ws'
import { emptyGlobalBoard, GameState } from './game_state'

type ActiveBoard = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'all'

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
    public readonly activePlayer: 'player1' | 'player2',
    public readonly activeBoard: ActiveBoard
  ) {}
}

export const initialTurn = (player1: WebSocket, player2: WebSocket): Turn => {
  const gameState = new GameState(player1, player2, emptyGlobalBoard)
  return new Turn(gameState, 'player1', 'all')
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
