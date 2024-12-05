// Source https://dev.to/monaye/refactor-davidwalsh-s-debounce-function-5afc
type UnknownFunction = (...args: any[]) => void;

/**
 * Throttling enforces a maximum number of times a function can be called over time. 
 * As in “execute this function at most once every 100 milliseconds.”
 * 
 * @param callback 
 * @param limit 
 * @param callAtTheEnd true to call the function at the end of the delay
 * @returns 
 */
const throttle = (callback: UnknownFunction, limit: number, callAtTheEnd: boolean = false) => {
  let waiting = false;                      // Initially, we're not waiting
  let wasCalled = false;
  let _args: any[]
  return function (this: any, ...args: any[]) {                      // We return a throttled function
    wasCalled = true;
    _args = args;
    if (!waiting) {                      // If we're not waiting
      if (!callAtTheEnd) {
        callback.apply(this, _args);       // Execute users function
      }
      waiting = true;                    // Prevent future invocations
      setTimeout(() => {                 // After a period of time
        waiting = false;                 // And allow future invocations
        if (wasCalled && callAtTheEnd) {
          callback.apply(this, _args)    // we call at the end of the timeout, with the latest arguments
        } 
        wasCalled = false;
      }, limit);
    }
  }
}

export { throttle };