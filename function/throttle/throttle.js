function throttle(fn, timeout, options = {}) {
  let lastInvoke = Date.now();
  const thisArg = this;
  let timer;
  function throttledFn(...args) {
    const remainingTime = (lastInvoke + timeout) - Date.now();
    if (remainingTime <= 0) {
      const res = fn.call(thisArg, ...args)
      if (timer) {
        clearTimeout(timer)
        timer = null;
      }
      lastInvoke = Date.now();
      return res;
    }
    else if (!timer) {
      timer = setTimeout(() => {
        const res = fn.call(thisArg, ...args)
        lastInvoke = Date.now();
        // timer = null;
        return res;
      }, remainingTime)
    }
  }
  return throttledFn;
}

function test(cb, count, timeout, options = {}, ...args) {
  const throttledFn = throttle(cb, timeout, options)
  const interval = 100;
  let invokeCount = 0;
  const timer = setInterval(() => {
    console.log(`====[${++invokeCount}]====`)
    throttledFn(...args)
  }, interval)
  setTimeout(() => {
    clearInterval(timer)
  }, count * interval)
}

const log = console.log;
test(log, 100, 1000, undefined, 'invoked')
