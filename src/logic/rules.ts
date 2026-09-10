import type { Geometry } from '@/logic/geometry.ts'
import type { Board, Cell } from '@/logic/board.ts'
import { buildCells } from '@/logic/mine.ts'

export function cascadeReveal(
  cells: readonly Cell[],
  index: number,
  geometry: Geometry,
): ReadonlySet<number> {
  const revealed = new Set<number>()
  const stack: number[] = [index]

  while (stack.length > 0) {
    const idx = stack.pop()

    if (idx === undefined) continue
    const cell = cells[idx]

    if (!cell) continue

    if (revealed.has(idx) || cell.revealed || cell.flagged) continue
    revealed.add(idx)

    if (cell.mine) continue
    if (cell.adjacent !== 0) continue

    const [cx, cy] = geometry.toCoords(idx)

    for (const n of geometry.findNeighbors(cx, cy)) {
      const neighbor = cells[n]
      if (!neighbor?.revealed && !neighbor?.flagged) stack.push(n)
    }
  }

  return revealed
}

export function withSafeFirstMove(board: Board, index: number, geometry: Geometry): Cell[] {
  const clicked = board.cells[index]
  if (board.state !== 'idle' || !clicked?.mine) return board.cells

  const targetIndex = board.cells.findIndex((cell) => !cell.mine)
  if (targetIndex === -1) return board.cells

  const mines = new Set<number>()
  board.cells.forEach((cell, i) => {
    if (cell.mine) mines.add(i)
  })
  mines.delete(index)
  mines.add(targetIndex)

  const rebuilt = buildCells(mines, geometry, board.cells.length)
  return rebuilt.map((cell, i) => ({ ...cell, flagged: board.cells[i]?.flagged ?? false }))
}

export function hasWon(cells: readonly Cell[]): boolean {
  return cells.every((cell) => cell.revealed || cell.mine)
}

export function hasGameEnded(board: Board): boolean {
  return board.state === 'won' || board.state === 'lost'
}

export function revealAllMines(cells: readonly Cell[]): Cell[] {
  return cells.map((cell) => (cell.mine ? { ...cell, revealed: true } : cell))
}
