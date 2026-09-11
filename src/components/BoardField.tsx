import { memo, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import type { Cell } from '@/logic/board.ts'
import styles from './BoardField.module.scss'

type BoardFieldProps = {
  cell: Cell
  index: number
  disabled: boolean
  onReveal: (index: number) => void
  onFlag: (index: number) => void
}

function fieldContent(cell: Cell): ReactNode {
  if (cell.flagged) return <span aria-hidden="true">&#128681;</span>
  if (!cell.revealed) return null
  if (cell.mine) return <span aria-hidden="true">&#128163;</span>
  return cell.adjacent > 0 ? <span aria-hidden="true">{cell.adjacent}</span> : null
}

export const BoardField = memo(function BoardField({
  cell,
  index,
  disabled,
  onReveal,
  onFlag,
}: BoardFieldProps) {
  const handleClick = () => {
    onReveal(index)
  }

  const handleContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onFlag(index)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key.toLowerCase() !== 'f') return
    event.preventDefault()
    onFlag(index)
  }

  return (
    <button
      type="button"
      className={styles.field}
      disabled={disabled}
      data-revealed={String(cell.revealed)}
      data-flagged={String(cell.flagged)}
      data-mine={(cell.revealed && cell.mine) || undefined}
      data-adjacent={cell.revealed && !cell.mine ? cell.adjacent : undefined}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
    >
      {fieldContent(cell)}
    </button>
  )
})
