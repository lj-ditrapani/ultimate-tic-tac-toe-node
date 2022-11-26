import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { z } from 'zod'
import { Game } from './game'
import { rand } from './random'

// register
// update
// play

const t = initTRPC.create()

const game = new Game(rand)

const appRouter = t.router({
  greeting: t.procedure.input(z.object({ name: z.string() })).query((req) => {
    const { input } = req
    return {
      text: `Hello ${input.name}` as const,
    }
  }),
  register: t.procedure.input(z.object({})).mutation(game.register),
  status: t.procedure.input(z.object({})).query((_) => 'state of game...'),
  play: t.procedure.input(z.object({})).mutation((_) => 'made a move'),
})

export type AppRouter = typeof appRouter

createHTTPServer({ router: appRouter }).listen(3000)
