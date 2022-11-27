const min = 100_000_000_000_000
const max = 999_999_999_999_999
export const rand = () => min + Math.floor(Math.random() * (max - min))
