// Source https://dev.to/monaye/refactor-davidwalsh-s-debounce-function-5afc
type UnknownFunction = (...args: any[]) => void;

/**
 * Creates a debounced function that delays invoking the provided function until after the specified delay.
 * Optionally, the function can be invoked immediately on the leading edge of the delay.
 *  
 * Debouncing enforces that a function not be called again until a certain amount of time has passed without it being called. 
 * As in “execute this function only if 100 milliseconds have passed without it being called.”
 * 
 * We have to be careful with this implementation as it does not call the function at the end of the delay for immediate .
 *
 * @param func - The function to debounce.
 * @param delay - The number of milliseconds to delay.
 * @param immediate - If `true`, the function will be invoked on the leading edge of the delay.
 * @returns A new debounced function.
 */
const debounce = (func: UnknownFunction, delay: number, immediate?: boolean): UnknownFunction => {
  let timerId: number | undefined;
  return (...args: unknown[]) => {
    const boundFunc = func.bind(undefined, ...args);
    clearTimeout(timerId);
    if (immediate && !timerId) {
      boundFunc();
    }
    const calleeFunc = immediate ? () => {
      timerId = undefined;
    } : boundFunc;
    timerId = window.setTimeout(calleeFunc, delay);
  };
};

export { debounce };