import { Server } from 'ws'
import { ConnectionHandler, Game, messageHandler } from './game'
import { State } from './state'

const wss: Server = new Server({ port: 47777 })

new Game(wss, new State(), new ConnectionHandler(messageHandler)).listen()
