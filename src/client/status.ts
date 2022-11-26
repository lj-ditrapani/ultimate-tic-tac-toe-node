import { ActiveBoard, LocalBoard } from './local_board'
import {
  Entity,
  getEntity,
  getPlayer,
  getWinner,
  parseActiveBoard,
  parseBoard,
  Winner
} from './parse_status_string'

abstract class BaseStatus {
  public readonly me: Entity
  public readonly globalBoard: LocalBoard[]
  public readonly activeBoard: ActiveBoard

  constructor(statusString: string) {
    this.me = getEntity(statusString)
    this.activeBoard = parseActiveBoard(statusString)
    this.globalBoard = statusString
      .slice(5)
      .split('\n')
      .map(boardString => parseBoard(boardString))
  }
}

export class Init extends BaseStatus {
  public readonly statusType: 'init' = 'init'

  constructor(statusString: string) {
    super(statusString)
  }
}

export class ReadyPlayer1 extends BaseStatus {
  public readonly statusType: 'readyPlayer1' = 'readyPlayer1'

  constructor(statusString: string) {
    super(statusString)
  }
}

export class Turn extends BaseStatus {
  public readonly statusType: 'turn' = 'turn'
  public readonly activePlayer: 'player1' | 'player2'

  constructor(statusString: string) {
    super(statusString)
    this.activePlayer = getPlayer(statusString)
  }
}

export class GameOver extends BaseStatus {
  public readonly statusType: 'gameOver' = 'gameOver'
  public readonly winner: Winner

  constructor(statusString: string) {
    super(statusString)
    this.winner = getWinner(statusString)
  }
}

export class Reset extends BaseStatus {
  public readonly statusType: 'reset' = 'reset'
  public readonly resetPlayer: 'player1' | 'player2'

  constructor(statusString: string) {
    super(statusString)
    this.resetPlayer = getPlayer(statusString)
  }
}

export type Status = Init | ReadyPlayer1 | Turn | GameOver | Reset

export const parseStatusString = (statusString: string): Status => {
  if (statusString.length !== 103) {
    throw new Error(
      'Bad statusString; incorrect length.  ' +
        `Length ${statusString.length}, ` +
        `statusString: ${statusString}`
    )
  }
  switch (statusString[1]) {
    case 'I':
      return new Init(statusString)
    case 'R':
      return new ReadyPlayer1(statusString)
    case 'T':
      return new Turn(statusString)
    case 'G':
      return new GameOver(statusString)
    case 'S':
      return new Reset(statusString)
    default:
      throw new Error(`Invalid status string at postion 1: ${statusString}`)
  }
}
