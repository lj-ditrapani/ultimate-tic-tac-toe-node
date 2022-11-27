import { z } from 'zod'
import type { Infer } from './zod-helper'

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
export const moveSchema = z.object({
  playerId: z.number(),
  boardNum: boardNumSchema,
  cellNum: cellNumSchema,
})

export type BoardNum = z.infer<typeof boardNumSchema>
export type CellNum = BoardNum
export type Move = Infer<typeof moveSchema>
export type Player = 'p1' | 'p2'
export type State =
  | { name: 'init' | 'ready p1' | 'tie' | 'reset p1' }
  | { name: 'turn' | 'win'; player: Player }
export type ActiveBoard = z.infer<typeof boardNumSchema> | 'all'
export type Cell = 'E' | 'X' | 'O'
export type Board = {
  status: 'available' | 'X' | 'O' | 'tie'
  cells: [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
}
export type Boards = [Board, Board, Board, Board, Board, Board, Board, Board, Board]
export type GameState = {
  state: State
  activeBoard: ActiveBoard
  boards: Boards
}
export type PlayerInfo = { actor: 'p1' | 'p2'; id: number } | { actor: 'spectator' }
