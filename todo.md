Refactor drawBackground
- let drawGame do some of the work
- drawBackground doesn't call draw

- Publish to Docker hub
- add github action to build image
- add unit tests

- Add reset logic
- May want to return self-actor in status GameState payload so that player does not have to switch (p1/p2) on client side.  Server will control the switch entirely.
- display board winner on each board
