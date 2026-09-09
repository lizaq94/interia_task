export type Geometry = {
  toIndex(x: number, y: number): number
  toCoords(i: number): [number, number]
  inBounds(x: number, y: number): boolean
  findNeighbors(x: number, y: number): number[]
}

export function makeGeometry(width: number, height: number): Geometry {
  const toIndex = (x: number, y: number): number => y * width + x
  const toCoords = (i: number): [number, number] => [i % width, Math.floor(i / width)]
  const inBounds = (x: number, y: number): boolean => x >= 0 && x < width && y >= 0 && y < height

  const findNeighbors = (x: number, y: number) => {
    const neighbors = []
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue
        const nx = x + dx
        const ny = y + dy
        if (inBounds(nx, ny)) neighbors.push(toIndex(nx, ny))
      }
    }
    return neighbors
  }

  return { toIndex, toCoords, inBounds, findNeighbors }
}

export function resolveMinePositions(
  mines: [number, number][],
  geometry: Geometry,
): ReadonlySet<number> {
  const placedMines = new Set<number>()

  for (const [x, y] of mines) {
    if (!geometry.inBounds(x, y)) continue
    placedMines.add(geometry.toIndex(x, y))
  }

  return placedMines
}
