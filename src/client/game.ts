import { numToPoint, Ui } from './ui.js'
import type { trpcClient } from '../client.js'
import type { GameState, PlayerInfo, CellNum } from '../models'
import { initialGameState } from '../game.js'
import { keyCodes } from 'term-grid-ui'

export class Game {
  private playerInfo: PlayerInfo = { actor: 'spectator' }
  private gameState: GameState = initialGameState()
  private isBoardSelect = false
  private activeBoard: Point = { y: 1, x: 1 }
  private activeCell: Point = { y: 1, x: 1 }

  constructor(private readonly ui: Ui, private readonly trpc: typeof trpcClient) {
    ui.setOnInputHandler(this.onInput)
    ui.drawBackground()
    ui.drawGame(this.gameState)
  }

  async register() {
    this.playerInfo = await this.trpc.register.mutate({})
    this.ui.writeMessage(this.playerInfo.actor)
  }

  readonly gameLoop = async () => {
    this.gameLoop2(await this.trpc.status.query({}))
  }

  readonly gameLoop2 = async (gameState: GameState) => {
    this.gameState = gameState
    this.ui.drawGame(this.gameState)
    const state = this.gameState.state
    this.ui.writeActor(this.playerInfo)
    if (state.name === 'turn' || state.name === 'win') {
      this.ui.writeMessage(`${state.name} ${state.player}`)
    } else {
      this.ui.writeMessage(state.name)
    }
    if (state.name === 'turn' && state.player === this.playerInfo.actor) {
      const cell: Point = { y: 1, x: 1 }
      const board =
        this.gameState.activeBoard === 'all'
          ? cell
          : numToPoint(this.gameState.activeBoard)
      if (this.gameState.activeBoard === 'all') {
        this.isBoardSelect = true
      } else {
        this.ui.markActiveCell(board, cell)
        this.activeCell = cell
      }
      this.activeBoard = board
      this.ui.draw()
    } else {
      this.ui.draw()
      setTimeout(this.gameLoop, 500)
    }
  }

  private readonly onInput = (data: string) => {
    if (data === 'q') {
      this.ui.writeMessage('Ok, fine...bye!')
      this.ui.draw()
      this.ui.done()
    }
    const state = this.gameState.state
    if (state.name !== 'turn' || state.player !== this.playerInfo.actor) {
      this.ui.writeMessage(`input: ${data}`)
      this.ui.draw()
      return
    }
    switch (data) {
      case keyCodes.arrowLeft:
        return this.moveLeft()
      case keyCodes.arrowRight:
        return this.moveRight()
      case keyCodes.arrowUp:
        return this.moveUp()
      case keyCodes.arrowDown:
        return this.moveDown()
      case keyCodes.enter:
        return this.select(this.playerInfo)
    }
  }

  private moveLeft() {
    if (this.isBoardSelect) {
      const previousBoard = this.activeBoard
      this.activeBoard = { y: this.activeBoard.y, x: (this.activeBoard.x - 1) as 0 }
      this.ui.markActiveBoard(previousBoard, this.activeBoard)
      this.ui.draw()
    } else {
    }
  }
  private moveRight() {
    if (this.isBoardSelect) {
    } else {
    }
  }
  private moveUp() {
    if (this.isBoardSelect) {
    } else {
    }
  }
  private moveDown() {
    if (this.isBoardSelect) {
    } else {
    }
  }
  private async select(playerInfo: { actor: 'p1' | 'p2'; id: number }) {
    if (this.isBoardSelect) {
      this.isBoardSelect = false
      this.ui.markActiveCell(this.activeBoard, { y: 1, x: 1 })
      this.ui.draw()
    } else {
      const boardNum = point2Num(this.activeBoard)
      const cellNum = point2Num(this.activeCell)
      const gameState = await this.trpc.move.mutate({
        playerId: playerInfo.id,
        boardNum,
        cellNum,
      })
      this.gameLoop2(gameState)
    }
  }
}

type Point = { y: 0 | 1 | 2; x: 0 | 1 | 2 }
const point2Num = (point: Point) => (point.y * 3 + point.x) as CellNum
