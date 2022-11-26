const min = 100_000_000
const max = 999_999_999
export const rand = () => min + Math.random() * (max - min)
