export function listsToObj<T>(keys: string[], values: T[]) {
  const obj: { [index: string]: T } = {}
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i]
    const value = values[i]
    obj[key] = value
  }
  return obj
}

export function sortBy<T>(fn: (v: T) => number, list: T[]) {
  return list.sort((a, b) => {
    const vA = fn(a)
    const vB = fn(b)
    if (vA < vB) {
      return -1
    }
    if (vA > vB) {
      return 1
    }
    return 0
  })
}

export function uniqueBy<T>(fn: (v: T) => any, arr: T[]): T[] {
  const bucket = new Map()
  for (let i = arr.length; i--;) {
    const ele = arr[i]
    bucket.set(fn(ele), ele)
  }
  return [...bucket.values()].reverse()
}