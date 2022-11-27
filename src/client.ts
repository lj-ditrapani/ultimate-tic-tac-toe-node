import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { Game } from './client/game.js'
import { makeUi } from './client/ui.js'
import type { AppRouter } from './server'

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
})

const ui = makeUi()
const game = new Game(ui, trpcClient)
await game.register()
