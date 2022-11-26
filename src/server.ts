import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { z } from 'zod'

// register
// update
// play

const t = initTRPC.create()

const appRouter = t.router({
  greeting: t.procedure.input(z.object({ name: z.string() })).query((req) => {
    const { input } = req
    return {
      text: `Hello ${input.name}` as const,
    }
  }),
})

export type AppRouter = typeof appRouter

createHTTPServer({ router: appRouter }).listen(3000)
