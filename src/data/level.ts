import raw from './saper-plansze.json'
import type { Level } from '@/logic/board.ts'

type RawLevel = (typeof raw)['levels'][number]

const toMine = (pair: readonly number[], levelId: string): [x: number, y: number] => {
  const [x, y] = pair
  if (x === undefined || y === undefined) {
    throw new Error(`Invalid pair for level ${levelId}`)
  }
  return [x, y]
}

const toLevel = (level: RawLevel): Level => ({
  id: level.id,
  name: level.name,
  width: level.width,
  height: level.height,
  mineCount: level.mineCount,
  mines: level.mines.map((pair) => toMine(pair, level.id)),
})

export const levels = raw.levels.map(toLevel)
const [first] = levels

if (first === undefined) {
  throw new Error('saper-plansze.json contains no levels')
}

export const defaultLevel: Level = first
