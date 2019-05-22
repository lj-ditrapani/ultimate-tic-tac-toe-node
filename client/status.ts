import { ActiveBoard, LocalBoard } from './local_board'
import { parseActiveBoard, parseBoard } from './parse_status_string'

abstract class BaseStatus {
  public readonly globalBoard: LocalBoard[]
  public readonly activeBoard: ActiveBoard

  constructor(statusString: string) {
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
  public readonly activePlayer: 'me' | 'other'

  constructor(statusString: string) {
    super(statusString)
    this.activePlayer = 'me'
  }
}

export class GameOver extends BaseStatus {
  public readonly statusType: 'gameOver' = 'gameOver'
  public readonly winner: 'me' | 'other' | 'T'

  constructor(statusString: string) {
    super(statusString)
    this.winner = 'me'
  }
}

export class Reset extends BaseStatus {
  public readonly statusType: 'reset' = 'reset'
  public readonly resetPlayer: 'me' | 'other'

  constructor(statusString: string) {
    super(statusString)
    this.resetPlayer = 'me'
  }
}

export type Status = Init | ReadyPlayer1 | Turn | GameOver | Reset
