import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './server'

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
})

const p1 = await trpc.register.mutate({})
console.log(p1)
if (p1.id === undefined) {
  throw 'what, no p1?'
}
const p2 = await trpc.register.mutate({})
console.log(p2)
if (p2.id === undefined) {
  throw 'what, no p2?'
}
const spectator = await trpc.register.mutate({})
console.log(spectator)
const status1 = await trpc.status.query({})
console.log(status1)
const status2 = await trpc.status.query({})
console.log(status2)
const p = await trpc.play.mutate({ playerId: p1.id, boardNum: 3, cellNum: 2 })
console.log(p)
const status3 = await trpc.status.query({})
console.log(status3)
