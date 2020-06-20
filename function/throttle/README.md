# JavaScript Function Throttle

## 函数节流

函数节流的核心思想是，在频繁地触发一个回调函数的时候，对回调函数的执行做指定时间的延迟，保证在指定的时间内，只会触发回调函数一次。

**只触发回调函数一次** 同时还意味着，回调函数在指定的时间内，应该至少要执行一次。

与函数防抖不同的是，函数节流不需要等到最后一次操作之后再去执行回调函数，而是*只要延迟等待的时间达到了，就执行一次函数* ，就像是在控制水龙头的水流，在指定时间一滴一滴往下落一样，只要间隔的时间够了，就执行一次，重复触发回调函数不会重新计时。

函数节流通常用在一些需要频繁触发一个异步回调函数的情况，通常这个异步回调还会涉及到一些网络请求等等，例如下拉加载更多的场景，不需要等待用户停止下拉才去执行，而是只要间隔了指定时间就执行。

## 代码实现

```js
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
        timer = null;
        return res;
      }, remainingTime)
    }
  }
  return throttledFn;
}
```

代码中在`remainingTime >0` 的时候进行`setTimeout` 是为了保证只触发了一次回调函数的时候，回调函数也可以正常执行。（这个时候就相当于是一个 `debounce`）

同时要注意，`setTimeout` 应该是一个间隔内只设置一个，而不是每次触发在判断`remainingTime > 0` 的时候都去设置一个定时器，否则就可能出现一个间隔内设置了多个定时器，最后一个间隔内执行了多次回调函数的情况。