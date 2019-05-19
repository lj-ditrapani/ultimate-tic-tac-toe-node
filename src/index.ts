import { Server } from 'ws'
import {
  connectionHandler,
  Game,
  impureMessageHandlerFactory,
  messageHandler
} from './game'
import { State } from './state'

const wss: Server = new Server({ port: 47777 })
const state = new State()
const impureMessageHandler = impureMessageHandlerFactory(state, messageHandler)
new Game(wss, state, connectionHandler, impureMessageHandler).listen()
