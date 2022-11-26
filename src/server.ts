import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { z } from 'zod'

// register
// update
// play

const t = initTRPC.create()
const router = t.router
const publicProcedure = t.procedure

const appRouter = router({
  greeting: publicProcedure.input(z.object({ name: z.string() })).query((req) => {
    const { input } = req
    return {
      text: `Hello ${input.name}` as const,
    }
  }),
})

export type AppRouter = typeof appRouter

const { listen } = createHTTPServer({
  router: appRouter,
})
// The API will now be listening on port 3000!
listen(3000)
