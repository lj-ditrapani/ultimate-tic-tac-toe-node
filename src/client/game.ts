import type { Ui } from './ui.js'
import type { trpcClient } from '../client.js'
import type { GameState, PlayerInfo, CellNum } from '../models'
import { initialGameState } from '../game.js'
import { keyCodes } from 'term-grid-ui'
import { gridFind, GridNum, numToPoint, Point } from './helpers.js'

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
      const board =
        this.gameState.activeBoard === 'all'
          ? this.findeAvailableBoard()
          : numToPoint(this.gameState.activeBoard)
      this.ui.markActiveBoard(board)
      if (this.gameState.activeBoard === 'all') {
        this.isBoardSelect = true
      } else {
        this.activeCell = this.findEmptyCell()
        this.ui.markActiveCell(board, this.activeCell)
      }
      this.activeBoard = board
    } else {
      const boardNum = this.gameState.activeBoard
      if (boardNum !== 'all') {
        this.ui.markActiveBoard(numToPoint(boardNum))
      }
      setTimeout(this.gameLoop, 500)
    }
    this.ui.draw()
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
      this.activeBoard = { y: this.activeBoard.y, x: (this.activeBoard.x - 1) as GridNum }
      this.ui.markActiveBoard(this.activeBoard)
      this.ui.draw()
    } else {
      this.activeCell = { y: this.activeCell.y, x: (this.activeCell.x - 1) as GridNum }
      this.ui.markActiveCell(this.activeBoard, this.activeCell)
      this.ui.draw()
    }
  }
  private moveRight() {
    if (this.isBoardSelect) {
      this.activeBoard = { y: this.activeBoard.y, x: (this.activeBoard.x + 1) as GridNum }
      this.ui.markActiveBoard(this.activeBoard)
      this.ui.draw()
    } else {
      this.activeCell = { y: this.activeCell.y, x: (this.activeCell.x + 1) as GridNum }
      this.ui.markActiveCell(this.activeBoard, this.activeCell)
      this.ui.draw()
    }
  }
  private moveUp() {
    if (this.isBoardSelect) {
      this.activeBoard = { y: (this.activeBoard.y - 1) as GridNum, x: this.activeBoard.x }
      this.ui.markActiveBoard(this.activeBoard)
      this.ui.draw()
    } else {
      this.activeCell = { y: (this.activeCell.y - 1) as GridNum, x: this.activeCell.x }
      this.ui.markActiveCell(this.activeBoard, this.activeCell)
      this.ui.draw()
    }
  }
  private moveDown() {
    if (this.isBoardSelect) {
      this.activeBoard = { y: (this.activeBoard.y + 1) as GridNum, x: this.activeBoard.x }
      this.ui.markActiveBoard(this.activeBoard)
      this.ui.draw()
    } else {
      this.activeCell = { y: (this.activeCell.y + 1) as GridNum, x: this.activeCell.x }
      this.ui.markActiveCell(this.activeBoard, this.activeCell)
      this.ui.draw()
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

  private findeAvailableBoard(): Point {
    if (this.gameState.boards[4].status === 'available') {
      return { y: 1, x: 1 }
    }
    return gridFind((y, x) => {
      const point = { y, x }
      const board = this.gameState.boards[point2Num(point)]
      if (board.status === 'available') {
        return point
      }
      return undefined
    })
  }

  private findEmptyCell(): Point {
    const board = this.gameState.boards[point2Num(this.activeBoard)]
    if (board.cells[4] === 'E') {
      return { y: 1, x: 1 }
    }
    return gridFind((y, x) => {
      const point = { y, x }
      const cell = board.cells[point2Num(point)]
      if (cell === 'E') {
        return point
      }
      return undefined
    })
  }
}

const point2Num = (point: Point) => (point.y * 3 + point.x) as CellNum
