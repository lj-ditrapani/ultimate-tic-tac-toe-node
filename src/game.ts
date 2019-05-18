import { Server } from 'ws'
import { init, Status } from './models'

export class Game {
  public state: Status = init
  public readonly spectators: WebSocket[] = []

  constructor(private readonly wss: Server) {}

  public listen() {
    this.wss.on('connection', ws => {
      ws.on('message', message => {
        console.log('received: %s', message)
      })

      ws.send('Server: thank you for connecting')
    })
  }
}
