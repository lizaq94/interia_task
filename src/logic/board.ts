import { makeGeometry, resolveMinePositions } from '@/logic/geometry.ts'

export type Level = {
  id: string
  name: string
  width: number
  height: number
  mineCount: number
  mines: [number, number][]
}
export type Cell = {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
}
export type Board = {
  width: number
  height: number
  cells: Cell[]
  state: 'idle' | 'playing' | 'won' | 'lost'
}

export function createBoard(level: Level): Board {
  const geometry = makeGeometry(level.width, level.height)
  const cells: Cell[] = Array.from({ length: level.width * level.height }, () => ({
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

  const placedMines = resolveMinePositions(level.mines, geometry)

  for (const i of placedMines) {
    cellAt(i).mine = true
  }

  for (const i of placedMines) {
    const [x, y] = geometry.toCoords(i)
    for (const n of geometry.findNeighbors(x, y)) {
      cellAt(n).adjacent++
    }
  }

  return {
    width: level.width,
    height: level.height,
    cells,
    state: 'idle',
  }
}

export function revealCell(board: Board, index: number): Board
export function toggleFlag(board: Board, index: number): Board
