import { ITermGrid, makeTermGrid } from 'term-grid-ui'

export const makeUi = (): Ui => {
  const tg = makeTermGrid(24, 20)
  tg.clear()
  return new Ui(tg, process.exit)
}

export class Ui {
  constructor(private readonly tg: ITermGrid, private readonly exit: () => never) {}

  setOnInputHandler(handler: (data: string) => void) {
    this.tg.onInput(handler)
  }

  drawBackground() {
    this.tg.set(0, 0, 'X', 10, 20)
    this.tg.draw()
  }

  drawGame() {
    this.tg.text(1, 1, 'O', 63, 0)
    this.tg.draw()
  }

  writeMessage(message: string) {
    this.tg.text(19, 2, message, 63, 0)
    this.tg.draw()
  }

  done() {
    this.tg.reset()
    this.exit()
  }
}
