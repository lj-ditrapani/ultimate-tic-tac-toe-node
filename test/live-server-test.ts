import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import assert from 'node:assert/strict'
import type { AppRouter } from '../src/server'

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
})

let p1 = await trpc.register.mutate({})
console.log(p1)
assert.equal(p1.actor, 'p1')
if (p1.id === undefined) {
  throw 'I expected to be p1!'
}
assert.equal((await trpc.status.query({})).state.name, 'ready p1')
let p2 = await trpc.register.mutate({})
assert.equal(p2.actor, 'p2')
console.log(p2)
if (p2.id === undefined) {
  throw 'I expected to be p2!'
}
assert.equal((await trpc.status.query({})).state.name, 'turn')
const spectator = await trpc.register.mutate({})
assert.equal(spectator.actor, 'spectator')
assert.equal((await trpc.status.query({})).state.name, 'turn')
const m1 = await trpc.move.mutate({ playerId: p1.id, boardNum: 3, cellNum: 2 })
assert.deepEqual(m1.state, { name: 'turn', player: 'p2' })
assert.equal(m1.activeBoard, 2)
assert.equal(m1.boards[3].cells[2], 'X')
const m2 = await trpc.move.mutate({ playerId: p2.id, boardNum: 2, cellNum: 3 })
assert.deepEqual(m2.state, { name: 'turn', player: 'p1' })
assert.equal(m2.activeBoard, 3)
assert.equal(m2.boards[2].cells[3], 'O')
await trpc.move.mutate({ playerId: p1.id, boardNum: 3, cellNum: 4 })
await trpc.move.mutate({ playerId: p2.id, boardNum: 4, cellNum: 3 })
const m5 = await trpc.move.mutate({ playerId: p1.id, boardNum: 3, cellNum: 6 })
assert.deepEqual(m5.state, { name: 'turn', player: 'p2' })
assert.equal(m5.activeBoard, 6)
assert.equal(m5.boards[3].cells[6], 'X')
assert.equal(m5.boards[3].status, 'X')
await trpc.move.mutate({ playerId: p2.id, boardNum: 6, cellNum: 4 })
await trpc.move.mutate({ playerId: p1.id, boardNum: 4, cellNum: 0 })
await trpc.move.mutate({ playerId: p2.id, boardNum: 0, cellNum: 4 })
await trpc.move.mutate({ playerId: p1.id, boardNum: 4, cellNum: 1 })
await trpc.move.mutate({ playerId: p2.id, boardNum: 1, cellNum: 4 })
await trpc.move.mutate({ playerId: p1.id, boardNum: 4, cellNum: 2 })

await trpc.move.mutate({ playerId: p2.id, boardNum: 2, cellNum: 5 })
await trpc.move.mutate({ playerId: p1.id, boardNum: 5, cellNum: 8 })
await trpc.move.mutate({ playerId: p2.id, boardNum: 8, cellNum: 5 })
await trpc.move.mutate({ playerId: p1.id, boardNum: 5, cellNum: 4 })
await trpc.move.mutate({ playerId: p2.id, boardNum: 4, cellNum: 5 })
const m = await trpc.move.mutate({ playerId: p1.id, boardNum: 5, cellNum: 0 })

assert.equal(m.activeBoard, 0)
assert.equal(m.boards[5].cells[0], 'X')
assert.equal(m.boards[4].status, 'X')
assert.equal(m.boards[5].status, 'X')
assert.deepEqual(m.state, { name: 'win', player: 'p1' })

await trpc.reset.mutate(p1.id)
const r = await trpc.reset.mutate(p2.id)
assert.equal(r.activeBoard, 'all')
assert.equal(r.boards[5].cells[0], 'E')
assert.equal(r.boards[4].status, 'available')
assert.equal(r.boards[5].status, 'available')
assert.deepEqual(r.state, { name: 'turn', player: 'p1' })

const temp = p1
p1 = p2
p2 = temp

console.log('p1', p1)
console.log('p2', p2)

const x1 = await trpc.move.mutate({ playerId: p1.id, boardNum: 3, cellNum: 2 })
assert.deepEqual(x1.state, { name: 'turn', player: 'p2' })
assert.equal(x1.activeBoard, 2)
assert.equal(x1.boards[3].cells[2], 'X')

console.log('>>>>>>> SUCCESS!!!')
