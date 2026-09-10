import { describe, expect, it } from 'vitest'
import { draw, level } from '@/tests/helper.ts'
import { createBoard, revealCell, toggleFlag } from '@/logic/board.ts'

const threeMinesOnTheRight = level(5, 5, [
  [4, 0],
  [4, 2],
  [4, 4],
])
const singleMineInCorner = level(3, 3, [[2, 2]])

describe('board', () => {
  it('cascades through empty cells and stops on numbered ones', () => {
    const board = revealCell(createBoard(threeMinesOnTheRight), 0)

    expect(draw(board)).toBe(['0001.', '0002.', '0001.', '0002.', '0001.'].join('\n'))
  })

  it('keeps the first reveal safe by moving the mine to the lowest free index', () => {
    const board = revealCell(createBoard(singleMineInCorner), 8)

    expect(board.cells[8]?.mine).toBe(false)
    expect(board.cells[0]?.mine).toBe(true)
    expect(board.state).not.toBe('lost')
  })

  it('wins once every cell without a mine is revealed', () => {
    const board = createBoard(threeMinesOnTheRight)
    const played = board.cells.reduce(
      (acc, cell, i) => (cell.mine ? acc : revealCell(acc, i)),
      board,
    )
    expect(played.state).toBe('won')
  })

  it('toggles a flag and protects the flagged cell from being revealed', () => {
    const flagged = toggleFlag(createBoard(threeMinesOnTheRight), 7)

    expect(flagged.cells[7]?.flagged).toBe(true)
    expect(revealCell(flagged, 7)).toBe(flagged)
    expect(toggleFlag(flagged, 7).cells[7]?.flagged).toBe(false)
  })
})
