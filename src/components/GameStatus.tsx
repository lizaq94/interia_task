import type { Board } from '@/logic/board.ts'
import styles from './GameStatus.module.scss'

type GameStatusProps = {
  board: Board
  minesLeft: number
  onReset: () => void
}

const messages: Record<Board['state'], string> = {
  idle: 'Kliknij dowolne pole, żeby zacząć',
  playing: 'Gra w toku',
  won: 'Wygrana',
  lost: 'Przegrana',
}

export function GameStatus({ board, minesLeft, onReset }: GameStatusProps) {
  return (
    <div className={styles.status}>
      <p className={styles.counter}>Miny: {minesLeft}</p>

      <p className={styles.message} data-state={board.state} role="status">
        {messages[board.state]}
      </p>

      <button type="button" className={styles.reset} onClick={onReset}>
        Od nowa
      </button>
    </div>
  )
}
