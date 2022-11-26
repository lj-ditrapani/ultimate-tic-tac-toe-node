import WebSocket from 'ws'
import { Status } from './models/status'

export type NextStatus = (message: string, ws: WebSocket, status: Status) => Status

export const nextStatus: NextStatus = (
  message: string,
  ws: WebSocket,
  status: Status,
): Status => {
  switch (status.statusType) {
    case 'turn':
      const gameState = status.gameState
      const activePlayer =
        status.activePlayer === 'player1' ? gameState.player1 : gameState.player2
      if (ws === activePlayer) {
        return handleTurn(message, status)
      } else {
        return status
      }
    case 'gameOver':
      return status
    case 'reset':
      return status
    default:
      return status
  }
}

export const handleTurn = (message: string, status: Status): Status => {
  if (message === 'hi') {
    return status
  } else {
    return status
  }
}
