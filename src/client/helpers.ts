import type { CellNum } from '../models'

export const gridNums = [0, 1, 2] as const
export type GridNum = typeof gridNums[number]

export type Point = { y: GridNum; x: GridNum }

export const numToPoint = (num: CellNum): Point => ({
  y: Math.floor(num / 3) as GridNum,
  x: (num % 3) as GridNum,
})

export const gridFind = <T>(f: (y: GridNum, x: GridNum) => T | undefined): T => {
  for (const y of gridNums) {
    for (const x of gridNums) {
      const result = f(y, x)
      if (result !== undefined) {
        return result
      }
    }
  }
  throw new Error('Could not find suitable element')
}

export const gridEffect = (f: (y: GridNum, x: GridNum) => void): void => {
  for (const y of gridNums) {
    for (const x of gridNums) {
      f(y, x)
    }
  }
}
