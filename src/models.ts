import { z } from 'zod'
import type { Infer } from './zod-helper'

const playerSchema = z.enum(['p1', 'p2'])
export type Player = z.infer<typeof playerSchema>
export const stateSchema = z.discriminatedUnion('name', [
  z.object({ name: z.literal('init') }),
  z.object({ name: z.literal('ready p1') }),
  z.object({ name: z.literal('1st board') }),
  z.object({ name: z.literal('turn'), player: playerSchema }),
  z.object({ name: z.literal('win'), player: playerSchema }),
  z.object({ name: z.literal('tie') }),
  z.object({ name: z.literal('reset'), player: playerSchema }),
])
export type State = Infer<typeof stateSchema>
export const boardNumSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
])
export type BoardNum = z.infer<typeof boardNumSchema>

export type Cell = 'E' | 'X' | 'O'

export type Board = {
  status: 'available' | 1 | 2 | 'tie'
  cells: [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
}
export type Boards = [Board, Board, Board, Board, Board, Board, Board, Board, Board]
export type GameState = {
  state: State
  activeBoard: BoardNum
  boards: Boards
}
