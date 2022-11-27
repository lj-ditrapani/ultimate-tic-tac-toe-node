import type { Ui } from './ui'
import type { trpcClient } from '../client.js'
import type { PlayerInfo } from '../models'

export class Game {
  private playerInfo: PlayerInfo = { actor: 'spectator' }

  constructor(private readonly ui: Ui, private readonly trpc: typeof trpcClient) {
    ui.setOnInputHandler(this.onInput)
    ui.drawBackground()
  }

  async register() {
    this.playerInfo = await this.trpc.register.mutate({})
    this.ui.writeMessage(this.playerInfo.actor)
  }

  private readonly onInput = (data: string) => {
    this.ui.writeMessage(`You got data: ${data}`)
    if (data === 'q') {
      this.ui.writeMessage('Ok, fine...bye!')
      this.ui.done()
    }
  }
}
