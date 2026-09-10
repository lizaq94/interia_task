import type { Geometry } from '@/logic/geometry.ts'
import type { Cell } from '@/logic/board.ts'

export function resolveMinePositions(
  mines: [number, number][],
  geometry: Geometry,
): ReadonlySet<number> {
  const placedMines = new Set<number>()

  for (const [x, y] of mines) {
    if (!geometry.inBounds(x, y)) continue
    placedMines.add(geometry.toIndex(x, y))
  }

  return placedMines
}

export function buildCells(mines: ReadonlySet<number>, geometry: Geometry, size: number): Cell[] {
  const cells: Cell[] = Array.from({ length: size }, () => ({
    mine: false,
    revealed: false,
    flagged: false,
    adjacent: 0,
  }))

  const cellAt = (i: number): Cell => {
    const cell = cells[i]
    if (!cell) throw new Error(`Cell at index ${i} does not exist`)
    return cell
  }

  for (const i of mines) {
    cellAt(i).mine = true
  }

  for (const i of mines) {
    const [x, y] = geometry.toCoords(i)
    for (const n of geometry.findNeighbors(x, y)) {
      cellAt(n).adjacent++
    }
  }

  return cells
}
