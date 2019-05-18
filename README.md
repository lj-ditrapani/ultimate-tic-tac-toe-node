Ultimate Tic-tac-toe Server
===========================

LAN multiplayer Ultimate tic-tac-toe server in typescript on node.


Run it!
-------

```
npm install
npm start
```


Notes
-----

Game States
- Init
- ReadyPlayer1
- Turn
- GameOver
- Reset

Endpoints:
- GET /
    - sets cookie id (determines player 1 vs player 2) & returns html
- GET /js/file
    - returns static javascript
- GET /img/file
    - returns static png files
- GET /status
    - returns status string
- POST /play/index
    - current player takes her turn; returns status string
- POST /reset
    - when in GameOver state, either player can request a new game
- POST /accept-reset
    - when in reset state; next state is Turn

Status string: 10 lines of plain ASCII text.
Lines are seperated by a Line Feed (0x0A).
No trailing Line Feed.
The first line is 4 characters and has the format SSPB.
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
- P: Player
    - 1: Player1
    - 2: Player2
    - S: Spectator
- B: Active board; a number between 1-9 inclusive or A for any.

The other 9 lines each represent one of the 9 boards.
They all have the same format.
10 characters long with the format RCCCCCCCCC.
- R: Board state
    - A: available
    - 1: player 1 won this board
    - 2: player 2 won this board
    - T: this board is a tie
- C: Board Cell
    - E: Empty
    - X: player 1 has an X here
    - O: player 2 has an O here

Finite State Machine:

![doc/finite-state-machine.png](doc/finite-state-machine.png)
