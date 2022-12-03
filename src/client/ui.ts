import { repeat } from 'ramda'
import { blockElements, colors, ITermGrid, makeTermGrid } from 'term-grid-ui'
import type { Board, BoardNum, Cell, CellNum, GameState, PlayerInfo } from '../models'
import { gridEffect, GridNum, numToPoint, Point } from './helpers.js'

const height = 23
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
  private readonly boarderC = colors.darkCyan
  private readonly activeC = colors.yellow
  private readonly pendingC = colors.darkRed
  private readonly xC = colors.purple
  private readonly oC = colors.orange

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
    gridEffect((y, x) => {
      const p = pointToActiveBoardTgCoord({ y, x })
      this.tg.set(p.y, p.x, blockElements.lower12Block, this.boarderC, this.boarderC)
    })
    this.tg.draw()
  }

  draw() {
    this.tg.draw()
  }

  drawGame(gameState: GameState) {
    this.removeActiveBoard()
    gameState.boards.forEach((board, index) => {
      this.drawBoard(board, index as BoardNum)
    })
  }

  drawBoard(board: Board, index: BoardNum) {
    const boardPoint = numToPoint(index)
    if (board.status !== 'available') {
      const tag = board.status === 'tie' ? 't' : board.status.toLowerCase()
      const color =
        board.status === 'tie'
          ? colors.lightGrey
          : board.status === 'X'
          ? this.xC
          : this.oC
      this.setBoardStateTag(boardPoint, color, tag)
    }
    board.cells.forEach((cell, index) => {
      const cellPoint = numToPoint(index as CellNum)
      this.drawCell(boardPoint, cellPoint, cell)
    })
  }

  writeActor(playerInfo: PlayerInfo) {
    this.tg.text(19, 1, repeat(' ', width - 2).join(''), this.textC, this.textBg)
    this.tg.text(20, 1, repeat(' ', width - 2).join(''), this.textC, this.textBg)
    const actor = playerInfo.actor
    const name = actor === 'spectator' ? actor : `You are ${actor}`
    const marker =
      actor === 'spectator' ? '' : actor === 'p1' ? 'Your marker: X' : 'Your marker: Oh'
    this.tg.text(19, 1, name, this.textC, this.textBg)
    this.tg.text(20, 1, marker, this.textC, this.textBg)
  }

  writeMessage(message: string) {
    this.tg.text(21, 1, repeat(' ', width - 2).join(''), this.textC, this.textBg)
    this.tg.text(21, 1, message, this.textC, this.textBg)
  }

  drawCell(board: Point, cellPoint: Point, cellState: Cell) {
    const mark = cellState === 'E' ? ' ' : cellState
    const point = boardCellToTgCoord(board, cellPoint)
    const color = mark === 'X' ? this.xC : this.oC
    this.tg.set(point.y, point.x, mark, color, this.boardBg)
  }

  setBoardStateTag(board: Point, color: number, tag: string) {
    const p = pointToBoardStateTagTgCoord(board)
    this.tg.set(p.y, p.x, tag, color, this.boarderC)
  }

  markActiveBoard(board: Point) {
    this.removeActiveBoard()
    const p = pointToActiveBoardTgCoord(board)
    this.tg.fg(p.y, p.x, this.activeC)
  }

  markActiveCell(board: Point, cell: Point) {
    gridEffect((y, x) => {
      const p = boardCellToTgCoord(board, { y, x })
      this.tg.bg(p.y, p.x, this.boardBg)
    })
    const p = boardCellToTgCoord(board, cell)
    this.tg.bg(p.y, p.x, this.activeC)
  }

  drawActiveBoard(board: Point) {
    this.markActiveBoard(board)
    this.draw()
  }

  drawActiveCell(board: Point, cell: Point) {
    this.markActiveCell(board, cell)
    this.draw()
  }

  drawPendingCell(board: Point, cell: Point) {
    const p = boardCellToTgCoord(board, cell)
    this.tg.bg(p.y, p.x, this.pendingC)
    this.tg.draw()
  }

  done() {
    this.tg.reset()
    this.exit()
  }

  private removeActiveBoard() {
    gridEffect((y, x) => {
      const p = pointToActiveBoardTgCoord({ y, x })
      this.tg.fg(p.y, p.x, this.boarderC)
    })
  }

  private drawHBoarder(y: number) {
    for (const x of [...Array(width).keys()]) {
      this.tg.set(y, x, ' ', this.textC, this.boarderC)
    }
  }

  private drawVBoarder(x: number) {
    for (const y of [...Array(width).keys()]) {
      this.tg.set(y, x, ' ', this.textC, this.boarderC)
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

type TgCoord = { y: number; x: number }
const boardCellToTgCoord = (board: Point, cell: Point): TgCoord => ({
  y: zToTgCoord(board.y, cell.y),
  x: zToTgCoord(board.x, cell.x),
})
const pointToActiveBoardTgCoord = (board: Point): TgCoord =>
  pointToBoardHeaderTgCoord(board, 3)
const pointToBoardStateTagTgCoord = (board: Point): TgCoord =>
  pointToBoardHeaderTgCoord(board, 2)
const pointToBoardHeaderTgCoord = (board: Point, offset: 2 | 3): TgCoord => ({
  y: board.y * 6,
  x: offset + board.x * 6,
})
const zToTgCoord = (board: GridNum, cell: GridNum): number => 1 + board * 6 + cell * 2
