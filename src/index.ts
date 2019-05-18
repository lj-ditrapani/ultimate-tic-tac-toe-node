import { Server } from 'ws'
import { ConnectionHandler, Game } from './game'

const wss: Server = new Server({ port: 8080 })

new Game(wss, new ConnectionHandler()).listen()
