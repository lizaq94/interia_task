import type { Level } from '@/logic/board.ts'
import type { ChangeEvent } from 'react'
import styles from './LevelSelect.module.scss'

type LevelSelectProps = {
  levels: readonly Level[]
  selectedId: string
  onSelect: (level: Level) => void
}

export function LevelSelect({ levels, selectedId, onSelect }: LevelSelectProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const chosen = levels.find((level) => level.id === event.target.value)

    if (chosen) onSelect(chosen)
  }

  return (
    <label className={styles.wrapper}>
      <span className={styles.caption}>Poziom</span>
      <select className={styles.select} value={selectedId} onChange={handleChange}>
        {levels.map((level) => (
          <option key={level.id} value={level.id}>
            {level.name}
          </option>
        ))}
      </select>
    </label>
  )
}
