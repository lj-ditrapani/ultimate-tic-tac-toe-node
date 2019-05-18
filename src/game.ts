import { Server } from 'ws'
import { init, Status } from './models'

export class Game {
  state: Status = init

  constructor(private readonly wss: Server) {}

  listen() {
    this.wss.on('connection', ws => {
      ws.on('message', message => {
        console.log('received: %s', message)
      })

      ws.send('Server: thank you for connecting')
    })
  }
}
