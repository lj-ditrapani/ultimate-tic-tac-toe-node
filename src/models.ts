import { z } from 'zod'
import type { Infer } from './zod-helper'

const playerSchema = z.enum(['p1', 'p2'])
export type Player = z.infer<typeof playerSchema>
export const stateSchema = z.discriminatedUnion('name', [
  z.object({ name: z.literal('init') }),
  z.object({ name: z.literal('ready p1') }),
  z.object({ name: z.literal('turn'), player: playerSchema }),
  z.object({ name: z.literal('win'), player: playerSchema }),
  z.object({ name: z.literal('tie') }),
  z.object({ name: z.literal('reset'), player: playerSchema }),
])
export type State = Infer<typeof stateSchema>
