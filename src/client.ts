import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { Game } from './client/game.js'
import { makeUi } from './client/ui.js'
import type { AppRouter } from './server'
import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

dotenv.config()
const g = globalThis as unknown as { fetch: typeof fetch }
g.fetch = fetch
const host = process.env['host']

if (!host) {
  throw new Error(
    'host environment variable must be defined ' +
      'and point to ultimate tic-tac-toe server',
  )
}

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `http://${host}:3000`,
    }),
  ],
})

const ui = makeUi()
const game = new Game(ui, trpcClient)
await game.register()
