import WebSocket from 'ws'
import { emptyGlobalBoard, emptyGlobalBoardString, GameState } from './game_state'

type ActiveBoard = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'all'

const activeBoard2Char = (activeBoard: ActiveBoard): string =>
  activeBoard === 'all' ? 'A' : activeBoard.toString()

class Init {
  public readonly statusType: 'init' = 'init'

  public toString() {
    return 'INA\n' + emptyGlobalBoardString
  }
}

export const init = new Init()

export class ReadyPlayer1 {
  public readonly statusType: 'readyPlayer1' = 'readyPlayer1'

  constructor(public readonly player1: WebSocket) {}

  public toString() {
    return 'R1A\n' + emptyGlobalBoardString
  }
}

const player2Char = (player: 'player1' | 'player2'): string => {
  switch (player) {
    case 'player1':
      return '1'
    case 'player2':
      return '2'
    default:
      const exhaustiveCheck: never = player
      return exhaustiveCheck
  }
}

export class Turn {
  public readonly statusType: 'turn' = 'turn'

  constructor(
    public readonly gameState: GameState,
    public readonly activePlayer: 'player1' | 'player2',
    public readonly activeBoard: ActiveBoard
  ) {}

  public toString() {
    return (
      'T' +
      player2Char(this.activePlayer) +
      activeBoard2Char(this.activeBoard) +
      '\n' +
      this.gameState.toString()
    )
  }
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

  public toString() {
    return 'G' + this.winner + 'A\n' + this.gameState.toString()
  }
}

export class Reset {
  public readonly statusType: 'reset' = 'reset'

  constructor(public readonly gameState: GameState, public readonly resetPlayer: 1 | 2) {}

  public toString() {
    return 'S' + this.resetPlayer + 'A\n' + this.gameState.toString()
  }
}

export type Status = Init | ReadyPlayer1 | Turn | GameOver | Reset
