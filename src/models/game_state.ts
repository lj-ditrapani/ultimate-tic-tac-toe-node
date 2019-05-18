import WebSocket from 'ws'

type Cell = 'empty' | 'player1' | 'player2'

type BoardStatus = 'available' | 'player1Won' | 'player2Won' | 'tie'

class LocalBoard {
  constructor(public readonly status: BoardStatus, public readonly cells: Cell[]) {}
}

class GlobalBoard {
  constructor(public readonly localBoards: LocalBoard[]) {}
}

export class GameState {
  constructor(
    public readonly player1: WebSocket,
    public readonly player2: WebSocket,
    public readonly globalBoard: GlobalBoard
  ) {}
}
