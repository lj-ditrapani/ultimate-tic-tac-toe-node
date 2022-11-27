import { colors, ITermGrid, makeTermGrid } from 'term-grid-ui'

const height = 24
const width = 20

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
  private readonly active = colors.darkYellow
  private readonly xC = colors.darkBlue
  private readonly oC = colors.darkGreen

  constructor(private readonly tg: ITermGrid, private readonly exit: () => never) {}

  setOnInputHandler(handler: (data: string) => void) {
    this.tg.onInput(handler)
  }

  drawBackground() {
    this.tg.set(0, 0, 'X', this.xC, this.boarder)
    this.tg.set(10, 7, 'O', this.oC, this.boardBg)
    this.tg.set(10, 8, 'O', this.oC, this.active)
    this.drawHBoarder(0)
    this.draw2HLinesFor3HBoards(2)
    this.drawHBoarder(6)
    this.draw2HLinesFor3HBoards(8)
    this.drawHBoarder(12)
    this.draw2HLinesFor3HBoards(14)
    this.drawHBoarder(18)
    this.tg.draw()
  }

  drawGame() {
    this.tg.text(1, 1, 'O', 63, 0)
    this.tg.draw()
  }

  writeMessage(message: string) {
    this.tg.text(19, 1, message, this.textC, this.textBg)
    this.tg.draw()
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

  private draw2HLinesFor3HBoards(y: number) {
    this.draw3HLinesIn1Row(y)
    this.draw3HLinesIn1Row(y + 2)
  }

  private draw3HLinesIn1Row(y: number) {
    this.drawHLine(y, 1)
    this.drawHLine(y, 7)
    this.drawHLine(y, 13)
  }

  private drawHLine(y: number, x: number) {
    for (const i of [x, x + 2, x + 4]) {
      this.tg.set(y, i, '-', this.textC, this.boardBg)
    }
  }
}
