export function* range(start: number, stop: number) {
  for (let i = start; i <= stop; ++i) {
    yield i
  }
}