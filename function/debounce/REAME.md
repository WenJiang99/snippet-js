# Javascript Function Debounce 

## 函数防抖

函数防抖通常是在一些*输入框输入*、*搜索* 、*页面滚动onScroll* 等会频繁的触发事件监听函数的场景下，对监听函数进行防抖，使得函数能够延迟指定的时间才执行，而不是每次触发了就立即执行，减少浏览器的负担。

防抖的核心效果是每次触发了回调函数后，需要先延迟等待一个指定的时间`timeout` 才会去执行回调函数，如果在这个延迟等待的时间内再次触发了回调函数，则重新计算延迟等待时间。

在延迟等待的时间内多次触发回调函数，会以最后一次触发时间为准，计算延迟时间。

总结起来就是 **合并多个操作，最后一次操作停下来之后，再去执行回调函数**

## 代码实现

```js
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
        timer = null;
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
```

