import { Server } from 'ws'
import { ConnectionHandler, Game, messageHandler } from './game'
import { State } from './state'

const wss: Server = new Server({ port: 47777 })
const state = new State()
const connectionHandler = new ConnectionHandler(state, messageHandler)
new Game(wss, state, connectionHandler).listen()
