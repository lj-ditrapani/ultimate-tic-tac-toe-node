import { z } from 'zod'
import type { Infer } from './zod-helper'

const playerSchema = z.enum(['p1', 'p2'])
export type Player = z.infer<typeof playerSchema>
export type State =
  | { name: 'init' | 'ready p1' | 'tie' }
  | { name: 'turn' | 'win' | 'reset'; player: Player }
const tempNumbers = [
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
] as const
const boardNumSchema = z.union(tempNumbers)
const cellNumSchema = boardNumSchema
export type BoardNum = z.infer<typeof boardNumSchema>
export type CellNum = BoardNum
const activeBoardSchema = z.union([...tempNumbers, z.literal('all')])
export type ActiveBoard = z.infer<typeof activeBoardSchema>

export type Cell = 'E' | 'X' | 'O'

export type Board = {
  status: 'available' | 1 | 2 | 'tie'
  cells: [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
}
export type Boards = [Board, Board, Board, Board, Board, Board, Board, Board, Board]
export type GameState = {
  state: State
  activeBoard: ActiveBoard
  boards: Boards
}
export const playSchema = z.object({
  playerId: z.number(),
  boardNum: boardNumSchema,
  cellNum: cellNumSchema,
})
export type Play = Infer<typeof playSchema>
