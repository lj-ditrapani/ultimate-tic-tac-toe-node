import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { z } from 'zod'
import { Game } from './game.js'
import { moveSchema, resetSchema } from './models.js'
import { rand } from './random.js'

const t = initTRPC.create()

const game = new Game(rand)

const appRouter = t.router({
  register: t.procedure.input(z.object({})).mutation(game.register),
  status: t.procedure.input(z.object({})).query(game.status),
  move: t.procedure.input(moveSchema).mutation((req) => game.move(req.input)),
  reset: t.procedure.input(resetSchema).mutation((req) => game.reset(req.input)),
})

export type AppRouter = typeof appRouter

const port = 3000
console.log(`Starting server on port ${port}`)
createHTTPServer({ router: appRouter }).listen(port)
