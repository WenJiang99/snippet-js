# Javascript Function Curry

## 柯里化

**柯里化**是一种延迟执行指定函数的方法，只需要把`fn`函数所需的一部分参数传给`curry`函数，然后`curry`函数返回一个心寒函数来处理`fn`函数所需要的剩余的参数。

通过柯里化可以实现参数的复用、函数的延迟执行

```js
/**
 * 函数柯里化
 * @param {Function} fn 
 * @param  {...any} arg1 
 */
function curry(fn, ...arg1) {
  if (typeof fn !== 'function') {
    throw new TypeError('`fn` must be a function')
  }
  if (arg1.length >= fn.length) {
    return fn.call(undefined, ...arg1)
  }
  return function (...arg2) {
    return curry(fn, ...arg1.concat(arg2))
  }
}
```

## examples

```js
function add(x, y) {
  return x + y;
}
const tenBaseAdd = curry(add, 10)
console.log(tenBaseAdd(3)) // 13

console.log(curry(add, 1, 2), curry(add, 1)) // 3 Function

const curriedAdd = curry(add)
console.log(curriedAdd(1)) // Function
console.log(curriedAdd(1)(2)) // 3

```
