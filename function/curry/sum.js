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