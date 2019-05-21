import { Cell, Init, Status } from './status'

export const parseStatusString = (data: string): Status => {
  const player = getPlayer(data)
  console.log(player)
  return new Init([], 'all')
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
