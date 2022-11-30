import { numToPoint, Ui } from './ui.js'
import type { trpcClient } from '../client.js'
import type { GameState, PlayerInfo } from '../models'
import { initialGameState } from '../game.js'

export class Game {
  private playerInfo: PlayerInfo = { actor: 'spectator' }
  private gameState: GameState = initialGameState()
  // private activeBoard: Point = { y: 1, x: 1 }
  // private activeCell: Point = { y: 1, x: 1 }

  constructor(private readonly ui: Ui, private readonly trpc: typeof trpcClient) {
    ui.setOnInputHandler(this.onInput)
    ui.drawBackground()
    ui.drawGame(this.gameState)
  }

  async register() {
    this.playerInfo = await this.trpc.register.mutate({})
    this.ui.writeMessage(this.playerInfo.actor)
  }

  readonly gameLoop = async () => {
    this.gameState = await this.trpc.status.query({})
    this.ui.drawGame(this.gameState)
    const state = this.gameState.state
    if (state.name === 'turn' || state.name === 'win') {
      this.ui.writeMessage(`${state.name} ${state.player}`)
    } else {
      this.ui.writeMessage(state.name)
    }
    if (state.name === 'turn' && state.player === this.playerInfo.actor) {
      const cell: Point = { y: 1, x: 1 }
      const board =
        this.gameState.activeBoard === 'all'
          ? cell
          : numToPoint(this.gameState.activeBoard)
      this.ui.markActiveCell(null, board, cell)
    } else {
      setTimeout(this.gameLoop, 500)
    }
  }

  private readonly onInput = (data: string) => {
    if (data === 'q') {
      this.ui.writeMessage('Ok, fine...bye!')
      this.ui.done()
    }
    // TODO: check GameState.State
    // Only respond to input if its your turn
    this.ui.writeMessage(`input: ${data}`)
  }
}

type Point = { y: 0 | 1 | 2; x: 0 | 1 | 2 }
