import type { Ui } from './ui'
import type { trpcClient } from '../client.js'
import type { GameState, PlayerInfo } from '../models'
import { initialGameState } from '../game.js'

export class Game {
  private playerInfo: PlayerInfo = { actor: 'spectator' }
  private gameState: GameState = initialGameState()

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
    this.ui.writeMessage('hi')
    // TODO: if your turn, don't loop
    setTimeout(this.gameLoop, 500)
  }

  private readonly onInput = (data: string) => {
    // TODO: check GameState.State
    // Only respond to input if its your turn
    this.ui.writeMessage(`input: ${data}`)
    if (data === 'q') {
      this.ui.writeMessage('Ok, fine...bye!')
      this.ui.done()
    }
  }
}
