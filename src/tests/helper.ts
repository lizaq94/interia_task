import type { Board, Level } from '@/logic/board.ts'

export const draw = (board: Board): string =>
  Array.from({ length: board.height }, (_, y) =>
    board.cells
      .slice(y * board.width, (y + 1) * board.width)
      .map((cell) =>
        cell.flagged ? 'F' : !cell.revealed ? '.' : cell.mine ? '*' : String(cell.adjacent),
      )
      .join(''),
  ).join('\n')

export const level = (width: number, height: number, mines: [number, number][]): Level => ({
  id: 'test',
  name: 'Test',
  width,
  height,
  mineCount: mines.length,
  mines,
})
