import { Server } from 'ws'
import { connectionHandler, Game } from './game'

const wss: Server = new Server({ port: 8080 })

new Game(wss, connectionHandler).listen()
