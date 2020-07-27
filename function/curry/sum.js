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