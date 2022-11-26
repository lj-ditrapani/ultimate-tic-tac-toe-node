import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './server'
import fetch from 'node-fetch'

const globalAny = global as unknown as { fetch: typeof fetch }
globalAny.fetch = fetch

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
})

const res = await trpc.greeting.query({ name: 'John' })
console.log(res)
