server:
- add board select validation.  If activeBoard === 'all', client picks the board.  The board state of chosen board must be 'available', otherwise throw.

Refactor drawBackground
- let drawGame do some of the work
- drawBackground doesn't call draw

- Publish to Docker hub
- add github action to build image
- add unit tests

- Add reset logic
- May want to return self-actor in status GameState payload so that player does not have to switch (p1/p2) on client side.  Server will control the switch entirely.
