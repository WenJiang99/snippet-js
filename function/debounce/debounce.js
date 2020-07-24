const MAX_TIMEOUT = 1000 * 60 * 60 * 24;
function debounce(fn, timeout, options = {}) {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function.')
  }
  const thisArg = this;
  timeout = ~~timeout;
  const _timeout = Math.min(timeout, options.maxTimeout || MAX_TIMEOUT)
  let timer;
  function debouncedFn(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(
      () => {
        // timer = null;
        return fn.call(thisArg, ...args)
      },
      _timeout
    )
  }
  debouncedFn.clear = function () {
    if (timer) {
      clearTimeout(timer)
      timer = null;
    }
  }
  return debouncedFn;
}

function test(cb, count, timeout, options = {}, ...args) {
  const debouncedFn = debounce(cb, timeout, options)
  for (let i = 0; i < count; i++) {
    debouncedFn(...args)
  }
}

const log = console.log;
test(log, 1000, 1000, undefined, 'invoked')