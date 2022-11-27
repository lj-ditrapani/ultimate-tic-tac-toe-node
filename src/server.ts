import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { z } from 'zod'
import { Game } from './game.js'
import { playSchema } from './models.js'
import { rand } from './random.js'

const t = initTRPC.create()

const game = new Game(rand)

const appRouter = t.router({
  register: t.procedure.input(z.object({})).mutation(game.register),
  status: t.procedure.input(z.object({})).query(game.status),
  play: t.procedure.input(playSchema).mutation((req) => game.play(req.input)),
})

export type AppRouter = typeof appRouter

createHTTPServer({ router: appRouter }).listen(3000)
