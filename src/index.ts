import { Server } from 'ws'
import { Game } from './game'

const wss: Server = new Server({ port: 8080 })

new Game(wss).listen()
