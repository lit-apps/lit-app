/**
 * Returns a promise that resolves after a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to wait before the promise resolves.
 * @returns A promise that resolves after the specified delay.
 */
const wait = (ms: number) => {
  return new Promise(resolve => {
    setTimeout(() => { resolve(null) }, ms);
  })
}

export { wait };
