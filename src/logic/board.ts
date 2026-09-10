import { makeGeometry } from '@/logic/geometry.ts'
import { buildCells, resolveMinePositions } from '@/logic/mine.ts'
import {
  cascadeReveal,
  hasGameEnded,
  hasWon,
  revealAllMines,
  withSafeFirstMove,
} from '@/logic/rules.ts'

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
  state: State
}

type State = 'idle' | 'playing' | 'won' | 'lost'

export function createBoard(level: Level): Board {
  const geometry = makeGeometry(level.width, level.height)
  const placedMines = resolveMinePositions(level.mines, geometry)
  const cells = buildCells(placedMines, geometry, level.width * level.height)

  return {
    width: level.width,
    height: level.height,
    cells,
    state: 'idle',
  }
}

export function revealCell(board: Board, index: number): Board {
  const cell = board.cells[index]

  if (!cell) return board
  if (hasGameEnded(board)) return board
  if (cell.revealed) return board
  if (cell.flagged) return board

  const geometry = makeGeometry(board.width, board.height)

  const safeCells = withSafeFirstMove(board, index, geometry)
  const hasHitMine = safeCells[index]?.mine === true

  const toReveal = cascadeReveal(safeCells, index, geometry)
  const revealedCells = safeCells.map((current, i) => ({
    ...current,
    revealed: current.revealed || toReveal.has(i),
  }))

  const cells = hasHitMine ? revealAllMines(revealedCells) : revealedCells
  const state = hasHitMine ? 'lost' : hasWon(cells) ? 'won' : 'playing'

  return {
    width: board.width,
    height: board.height,
    cells,
    state,
  }
}

export function toggleFlag(board: Board, index: number): Board
