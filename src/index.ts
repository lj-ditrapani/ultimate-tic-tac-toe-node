import { Server } from 'ws'
import { Game, interpretConnection, messageHandlerFactory, nextStatus } from './game'
import { State } from './state'

const wss: Server = new Server({ port: 47777 })
const state = new State()
const messageHandler = messageHandlerFactory(state, nextStatus)
new Game(wss, state, interpretConnection, messageHandler).listen()
