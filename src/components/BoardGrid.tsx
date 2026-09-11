import type { Board } from '@/logic/board.ts'
import { BoardField } from './BoardField.tsx'
import styles from './BoardGrid.module.scss'

type BoardGridProps = {
  board: Board
  onReveal: (index: number) => void
  onFlag: (index: number) => void
}

export function BoardGrid({ board, onReveal, onFlag }: BoardGridProps) {
  const isOver = board.state === 'won' || board.state === 'lost'

  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(${board.width}, var(--field-size))` }}
    >
      {board.cells.map((cell, index) => (
        <BoardField
          key={index}
          cell={cell}
          index={index}
          disabled={isOver || (cell.revealed && cell.adjacent === 0)}
          onReveal={onReveal}
          onFlag={onFlag}
        />
      ))}
    </div>
  )
}
