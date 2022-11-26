import { Server } from 'ws'
import { Game, interpretConnection, messageHandlerFactory } from './game'
import { nextStatus } from './next_status'
import { State } from './state'

const wss: Server = new Server({ port: 44777 })
const state = new State()
const messageHandler = messageHandlerFactory(state, nextStatus)
new Game(wss, state, interpretConnection, messageHandler).listen()
