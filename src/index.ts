import { Server } from 'ws'
import { ConnectionHandler, Game, messageHandler } from './game'

const wss: Server = new Server({ port: 47777 })

new Game(wss, new ConnectionHandler(messageHandler)).listen()
