// Source https://dev.to/monaye/refactor-davidwalsh-s-debounce-function-5afc
type UnknownFunction = (...args: any[]) => void;

/**
 * Debouncing enforces that a function not be called again until a certain amount of time has passed without it being called. 
 * As in “execute this function only if 100 milliseconds have passed without it being called.”
 * 
 * @param func 
 * @param delay 
 * @param immediate 
 * @returns 
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
    // add window to prevent https://github.com/Microsoft/TypeScript/issues/30128
    timerId = window.setTimeout(calleeFunc, delay);
  };
};

export { debounce };