import { ActiveBoard, BoardStatus, Cell, LocalBoard } from './local_board'
import { Init, Status } from './status'

export const parseStatusString = (data: string): Status => {
  const player = getPlayer(data)
  console.log(player)
  return new Init(data)
}

const getPlayer = (statusString: string): 'player1' | 'player2' => {
  switch (statusString[0]) {
    case '1':
      return 'player1'
    case '2':
      return 'player2'
    default:
      throw new Error(`Invalid status string at postion 0: ${statusString}`)
  }
}

export const cell2Char = (cell: Cell): ' ' | 'X' | 'O' => {
  switch (cell) {
    case 'empty':
      return ' '
    case 'player1':
      return 'X'
    case 'player2':
      return 'O'
    default:
      const exhaustiveCheck: never = cell
      return exhaustiveCheck
  }
}

export const parseActiveBoard = (statusString: string): ActiveBoard => {
  const c = statusString[3]
  if (c === 'A') {
    return 'all'
  } else {
    const n = parseInt(c, 10)
    if (n >= 1 && n <= 9) {
      return n as ActiveBoard
    } else {
      throw new Error(`Bad ActiveBoard character. statusString: ${statusString}`)
    }
  }
}

export const parseBoard = (boardString: string): LocalBoard => {
  const boardStatus = parseBoardStatus(boardString)
  const cells = boardString
    .slice(1)
    .split('')
    .map(parseCell)
  return new LocalBoard(boardStatus, cells)
}

const parseBoardStatus = (boardStatusChar: string): BoardStatus => {
  switch (boardStatusChar) {
    case 'A':
      return 'available'
    case '1':
      return 'player1Won'
    case '2':
      return 'player2Won'
    case 'T':
      return 'tie'
    default:
      throw new Error(`Bad boardStatus char: ${boardStatusChar}`)
  }
}

const parseCell = (cellChar: string): Cell => {
  switch (cellChar) {
    case 'E':
      return 'empty'
    case 'X':
      return 'player1'
    case 'O':
      return 'player2'
    default:
      throw new Error(`Bad Cell char: ${cellChar}`)
  }
}
