import { blockElements, colors, ITermGrid, makeTermGrid } from 'term-grid-ui'
import type { Board, BoardNum, CellNum, GameState } from '../models'

const height = 24
const width = 19

export const makeUi = (): Ui => {
  const tg = makeTermGrid(height, width)
  tg.clear()
  return new Ui(tg, process.exit)
}

export class Ui {
  private readonly boardBg = colors.paleTurquoise
  private readonly textBg = colors.lightGrey
  private readonly textC = colors.black
  private readonly boarder = colors.darkCyan
  private readonly active = colors.orange
  private readonly xC = colors.darkBlue
  private readonly oC = colors.darkGreen

  constructor(private readonly tg: ITermGrid, private readonly exit: () => never) {}

  setOnInputHandler(handler: (data: string) => void) {
    this.tg.onInput(handler)
  }

  drawBackground() {
    for (const x of [...Array(width).keys()]) {
      for (const y of [...Array(width).keys()]) {
        this.tg.set(y, x, ' ', this.textC, this.boardBg)
      }
    }
    for (const x of [...Array(width).keys()]) {
      for (const y of [...Array(height - width).keys()]) {
        this.tg.set(y + width, x, ' ', this.textC, this.textBg)
      }
    }
    this.drawHBoarder(0)
    this.draw2HLinesFor3HBoards(2)
    this.drawHBoarder(6)
    this.draw2HLinesFor3HBoards(8)
    this.drawHBoarder(12)
    this.draw2HLinesFor3HBoards(14)
    this.drawHBoarder(18)
    this.drawVBoarder(0)
    this.draw2VLinesFor3VBoards(2)
    this.drawVBoarder(6)
    this.draw2VLinesFor3VBoards(8)
    this.drawVBoarder(12)
    this.draw2VLinesFor3VBoards(14)
    this.drawVBoarder(18)
    this.tg.draw()
  }

  drawGame(gameState: GameState) {
    const aBoard = gameState.activeBoard === 'all' ? 4 : gameState.activeBoard
    this.markActiveBoard(numToPoint(aBoard))
    gameState.boards.forEach((board, index) => {
      this.drawBoard(board, index as BoardNum)
    })
    this.tg.draw()
  }

  drawBoard(board: Board, index: BoardNum) {
    const boardPoint = numToPoint(index)
    board.cells.forEach((cell, index) => {
      if (cell !== 'E') {
        const cellPoint = numToPoint(index as CellNum)
        this.markCell(boardPoint, cellPoint, cell)
      }
    })
  }

  writeMessage(message: string) {
    this.tg.text(19, 1, message, this.textC, this.textBg)
    this.tg.draw()
  }

  markCell(board: Point, cell: Point, mark: 'X' | 'O') {
    const point = toTgCoord(board, cell)
    const color = mark === 'X' ? this.xC : this.oC
    this.tg.set(point.y, point.x, mark, color, this.boardBg)
  }

  markActiveCell(board: Point, cell: Point) {
    // TODO: Unmark previous active cell
    const point = toTgCoord(board, cell)
    this.tg.set(point.y, point.x, ' ', this.textC, this.active)
  }

  markActiveBoard(board: Point) {
    // TODO: Unmark previous active board
    const y = board.y * 6
    const x = 3 + board.x * 6
    this.tg.set(y, x, blockElements.lower12Block, this.active, this.boarder)
  }

  done() {
    this.tg.reset()
    this.exit()
  }

  private drawHBoarder(y: number) {
    for (const x of [...Array(width).keys()]) {
      this.tg.set(y, x, ' ', this.textC, this.boarder)
    }
  }

  private drawVBoarder(x: number) {
    for (const y of [...Array(width).keys()]) {
      this.tg.set(y, x, ' ', this.textC, this.boarder)
    }
  }

  private draw2HLinesFor3HBoards(y: number) {
    this.draw3HLinesIn1Row(y)
    this.draw3HLinesIn1Row(y + 2)
  }

  private draw2VLinesFor3VBoards(x: number) {
    this.draw3VLinesIn1Column(x)
    this.draw3VLinesIn1Column(x + 2)
  }

  private draw3HLinesIn1Row(y: number) {
    this.drawHLine(y, 1)
    this.drawHLine(y, 7)
    this.drawHLine(y, 13)
  }

  private draw3VLinesIn1Column(x: number) {
    this.drawVLine(1, x)
    this.drawVLine(7, x)
    this.drawVLine(13, x)
  }

  private drawHLine(y: number, x: number) {
    for (const i of [x, x + 2, x + 4]) {
      this.tg.set(y, i, '-', this.textC, this.boardBg)
    }
    for (const i of [x + 1, x + 3]) {
      this.tg.set(y, i, '+', this.textC, this.boardBg)
    }
  }

  private drawVLine(y: number, x: number) {
    for (const i of [y, y + 2, y + 4]) {
      this.tg.set(i, x, '|', this.textC, this.boardBg)
    }
  }
}

type Point = { y: 0 | 1 | 2; x: 0 | 1 | 2 }
type TgCoord = { y: number; x: number }
const toTgCoord = (board: Point, cell: Point): TgCoord => ({
  y: zToTgCoord(board.y, cell.y),
  x: zToTgCoord(board.x, cell.x),
})
const zToTgCoord = (board: 0 | 1 | 2, cell: 0 | 1 | 2): number => 1 + board * 6 + cell * 2
const numToPoint = (num: CellNum): Point => ({
  y: Math.floor(num / 3) as 0,
  x: (num % 3) as 0,
})
