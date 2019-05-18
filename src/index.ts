import * as WebSocket from 'ws'
import { Server } from 'ws'
import { Game } from './game'

const wss: Server = new WebSocket.Server({ port: 8080 })

new Game(wss).listen()
