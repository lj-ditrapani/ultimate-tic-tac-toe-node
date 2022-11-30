Refactor drawBackground
- let drawGame do some of the work
- drawBackground doesn't call draw
Should ui keep track of active board & active cell so it can erase?
Game needs to keep track anyway, so ui is wrong place.
Game needs to pass next active board & previous active board to ui
- same for cell (next & previous active cells)
- null if first time
This way ui can erase previous one
Game should skip played cells when user moves around, so only empty cells can be active.
Same for active boards.  Only available boards can become active (use can't move to a won or tied board).

Expand termGrid to have color ops
    - setBg(y, x, color)
    - setFg(y, x, color)
    This would allow you to just change colors whitout modifying (or having to remember) the values
