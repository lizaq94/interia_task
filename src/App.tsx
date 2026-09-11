import styles from './App.module.scss'
import { useMinesweeper } from '@/hooks/useMinesweeper.ts'
import { defaultLevel, levels } from '@/data/level.ts'
import { BoardGrid } from '@/components/BoardGrid.tsx'
import { LevelSelect } from '@/components/LevelSelect.tsx'
import { GameStatus } from '@/components/GameStatus.tsx'

export function App() {
  const { level, board, reveal, flag, reset, selectLevel, minesLeft } = useMinesweeper(defaultLevel)

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Minesweeper</h1>
      <div className={styles.controls}>
        <LevelSelect levels={levels} selectedId={level.id} onSelect={selectLevel} />
        <GameStatus board={board} minesLeft={minesLeft} onReset={reset} />
      </div>
      <BoardGrid board={board} onReveal={reveal} onFlag={flag} />
    </main>
  )
}
