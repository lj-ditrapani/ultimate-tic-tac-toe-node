State.update
    -> broadcast to players (conditional on status)

onConnection
    - update state/spectators if needed
    - send entity (p1, p2, or spectator) back to client ws
    - broadcast new state to all ws
