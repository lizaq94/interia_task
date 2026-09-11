import { type Board, createBoard, type Level, revealCell, toggleFlag } from '@/logic/board.ts'
import { useCallback, useReducer } from 'react'

type GameState = {
  level: Level
  board: Board
}

type GameAction =
  | { type: 'reveal'; index: number }
  | { type: 'flag'; index: number }
  | { type: 'reset' }
  | { type: 'selectLevel'; level: Level }

const startGame = (level: Level): GameState => ({ level, board: createBoard(level) })

const keepUnlessChanged = (state: GameState, board: Board): GameState => {
  if (board === state.board) return state
  return { ...state, board }
}

function gameReducer(state: GameState, action: GameAction) {
  switch (action.type) {
    case 'reveal':
      return keepUnlessChanged(state, revealCell(state.board, action.index))
    case 'flag':
      return keepUnlessChanged(state, toggleFlag(state.board, action.index))
    case 'reset':
      return startGame(state.level)
    case 'selectLevel':
      return action.level === state.level ? state : startGame(action.level)
  }
}

export function useMinesweeper(initialLevel: Level) {
  const [{ level, board }, dispatch] = useReducer(gameReducer, initialLevel, startGame)

  const reveal = useCallback((index: number) => {
    dispatch({ type: 'reveal', index })
  }, [])

  const flag = useCallback((index: number) => {
    dispatch({ type: 'flag', index })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [])

  const selectLevel = useCallback((level: Level) => {
    dispatch({ type: 'selectLevel', level })
  }, [])

  const minesLeft =
    board.cells.filter((cell) => cell.mine).length -
    board.cells.filter((cell) => cell.flagged).length

  return { level, board, reveal, flag, reset, selectLevel, minesLeft }
}
