import { Server } from 'ws'
import {
  ConnectionHandler,
  Game,
  impureMessageHandlerFactory,
  messageHandler
} from './game'
import { State } from './state'

const wss: Server = new Server({ port: 47777 })
const state = new State()
const impureMessageHandler = impureMessageHandlerFactory(state, messageHandler)
const connectionHandler = new ConnectionHandler(impureMessageHandler)
new Game(wss, state, connectionHandler).listen()
