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
    return fn(...arg1)
  }
  return function (...arg2) {
    return fn(...arg1, ...arg2)
  }
}

function add(x, y) {
  return x + y;
}

const tenBaseAdd = curry(add, 10)
console.log(tenBaseAdd(3))

console.log(curry(add, 1, 2), curry(add, 1))