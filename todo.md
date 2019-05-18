onMessage
    - compute next state
    - set state
    - broadcast new state to all ws

onConnection
    - compute Event
    - update state/spectators if needed
    - send entity (p1, p2, or spectator) back to client ws
    - broadcast new state to all ws
