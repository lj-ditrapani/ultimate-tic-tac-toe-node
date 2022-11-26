Ultimate Tic-tac-toe Server
===========================

Work in progress.

LAN multiplayer Ultimate tic-tac-toe server in typescript on node.
Websocket-based.

- Client: node cli app
- Server: node express


Run it!
-------


Install node with [https://github.com/nvm-sh/nvm](nvm).

```
nvm install     # one-time install
nvm use         # each time you enter the project directory
```

Now setup the project and run.

```
npm install
npm start
```


Notes
-----

Game Status
- Init
- ReadyPlayer1
- Turn
- GameOver
- Reset

Status string: 10 lines of plain ASCII text.
Lines are seperated by a Line Feed (0x0A).
No trailing Line Feed.
The first line is 4 characters and has the format PSSB.
- P: Player
    - 1: Player1
    - 2: Player2
    - S: Spectator
- SS: Game state
    - IN: Init
    - R1: Ready player 1
    - T1: Turn player 1
    - T2: Turn player 2
    - G1: GameOver; player 1 wins
    - G2: GameOver; player 2 wins
    - GT: GameOver; it's a tie
    - S1: Reset player 1
    - S2: Reset player 2
- B: Active board; a number between 1-9 inclusive or A for any.

The other 9 lines each represent one of the 9 boards.
They all have the same format.
10 characters long with the format RCCCCCCCCC.
- R: Board status
    - A: available
    - 1: player 1 won this board
    - 2: player 2 won this board
    - T: this board is a tie
- C: Board Cell
    - E: Empty
    - X: player 1 has an X here
    - O: player 2 has an O here

Finite State Machine:

![finite-state-machine.png](finite-state-machine.png)
