export interface Level {
  id: string
  name: string
  width: number
  height: number
  mineCount: number
  mines: [number, number][]
}
export interface Cell {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
}
export interface Board {
  width: number
  height: number
  cells: Cell[]
  state: 'idle' | 'playing' | 'won' | 'lost'
}
export function createBoard(level: Level): Board
export function revealCell(board: Board, index: number): Board
export function toggleFlag(board: Board, index: number): Board
