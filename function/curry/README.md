# Javascript Function Curry

## 函数参数固定的柯里化

**柯里化**是一种延迟执行指定函数的方法，只需要把`fn`函数所需的一部分参数传给`curry`函数，然后`curry`函数返回一个心寒函数来处理`fn`函数所需要的剩余的参数。

通过柯里化可以实现参数的复用、函数的延迟执行

如果函数的参数固定，则可以比较`args.length` 和 `fn.length`，当参数数量够了的时候，就触发计算过程，否则就一直累积存储参数

如果要实现不传参数时也可以触发计算，则再判断后续传入的参数是否为空即可。

```js
/**
 * 函数柯里化
 * @param {Function} fn 
 * @param  {...any} arg1 
 */
function curry() {
  const fn = arguments[0]
  const arg1 = Array.prototype.slice.call(arguments, 1)
  if (typeof fn !== 'function') {
    throw new TypeError('`fn` must be a function')
  }
  if (arg1.length >= fn.length) {
    return fn.call(undefined, ...arg1)
  }
  return function (...arg2) {
    if (arg2.length === 0) {
      return fn(...arg1)
    }
    return curry(fn, ...arg1.concat(arg2))
  }
}
```

### examples

```js
function add(x, y) {
  return x + y;
}
const tenBaseAdd = curry(add, 10)
console.log(tenBaseAdd(3)) // 10 + 3 => 13 

console.log(curry(add, 1, 2), curry(add, 1))  // 3, [Function]
```

## 参数不固定的柯里化

对于使用了剩余参数形式的函数，函数接收的参数数量是任意的，没办法通过`args.length >= fn.length` 来触发计算过程，因此需要通过特定的方式来触发计算过程。

### 不传参时触发计算

一个典型的例子是 `sum(1,2)(3,4,5,6)(7)()`函数，每次传递的参数数量是任意的，在不传入参数的时候，就返回结果。

```js
function curriedSum(fn, ...arg1) {
  if (typeof fn !== 'function') throw new TypeError('fn must be a function');
  return function (...arg2) {
    if (arg2.length === 0) {
      return fn(...arg1)
    }
    return curriedSum(fn, ...arg1.concat(...arg2))
  }
}


function sum(...nums) {
  return (nums || []).reduce((total, num) => total + num, 0)
}

const sumFn = curriedSum(sum, 1, 2, 3)(4, 5)(6);
console.log(sumFn, sumFn()) // Function 21
console.log(curriedSum(sum, 1, 2)(3)()) // 6
console.log(curriedSum(sum)()) // 0
```

### 调用指定方法时触发计算

一个典型的例子：

```js
sum(1,2,3)(4,5)(6,7)(8)
sum(9,10)(11,12)
sum.sumOf() // 1+2+3+4+5+6+7+8+9+10+11+12
```

可以链式调用，也可以分行调用，然后在调用特定方法`sumOf`时候才执行计算操作。

链式调用可以通过返回自身来实现，然后通过闭包来存储全部的参数，在最后调用`sumOf`方法的时候，执行计算`fn(...args)`

```js
function curryingSum(fn, ...arg1) {
  let args = arg1;
  function result(...arg2) {
    args = args.concat(arg2)
    return result;
  }
  result.sumOf = function () {
    return fn(...args)
  }
  return result;
}

const sumFun = curryingSum(sum, 1, 2, 3)
sumFun(4, 5)(6, 7)
sumFun(8, 9)(10, 11)(12)
sumFun.sumOf() // 1+2+3+4+5+6+7+8+9+10+11+12
```
