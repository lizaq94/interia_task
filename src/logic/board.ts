import { makeGeometry } from '@/logic/geometry.ts'
import { buildCells, resolveMinePositions } from '@/logic/mine.ts'
import {
  cascadeReveal,
  collectChordReveals,
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
  if (cell.flagged) return board

  const geometry = makeGeometry(board.width, board.height)
  const safeCells = withSafeFirstMove(board, index, geometry)

  const toReveal = cell.revealed
    ? collectChordReveals(safeCells, index, geometry)
    : cascadeReveal(safeCells, index, geometry)

  if (toReveal.size === 0) return board

  const revealedCells = safeCells.map((current, i) =>
    toReveal.has(i) ? { ...current, revealed: true } : current,
  )

  const hasHitMine = [...toReveal].some((i) => safeCells[i]?.mine)
  const cells = hasHitMine ? revealAllMines(revealedCells) : revealedCells
  const state = hasHitMine ? 'lost' : hasWon(cells) ? 'won' : 'playing'

  return {
    width: board.width,
    height: board.height,
    cells,
    state,
  }
}

export function toggleFlag(board: Board, index: number): Board {
  if (hasGameEnded(board)) return board

  const cell = board.cells[index]

  if (!cell || cell.revealed) return board
  return {
    ...board,
    cells: board.cells.map((current, i) =>
      i === index ? { ...current, flagged: !current.flagged } : current,
    ),
  }
}
