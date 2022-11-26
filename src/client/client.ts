import { colors, keyCodes, makeTermGrid } from 'term-grid-ui'
import WebSocket from 'ws'
import { parseStatusString } from './status'

const arg1 = process.argv[2]
const host = arg1 === undefined ? 'localhost' : arg1
const ws = new WebSocket(`ws://${host}:44777`)
const tg = makeTermGrid(13, 19)
tg.clear()

tg.onInput((data) => {
  switch (data) {
    case keyCodes.enter:
      tg.text(1, 1, 'Hello world!', colors.green, colors.black)
      break
    case 'q':
      tg.reset()
      process.exit()
  }
  tg.draw()
})

ws.on('message', (data) => {
  const status = parseStatusString(data.toString())
  for (const localBoard of status.globalBoard) {
    console.log(localBoard.status)
    console.log(localBoard.cells)
  }
  console.log(status.statusType)
  console.log(status.me)
  console.log(status.activeBoard)
})

ws.on('close', () => {
  tg.reset()
  process.exit()
})
