function bind(fn, thisArg, ...arg1) {
  if (typeof fn !== 'function') throw new TypeError('fn must be a function');
  return function (...arg2) {
    return fn.call(thisArg, ...arg1.concat(arg2))
  }
}

function anotherBind() {
  const fn = arguments[0], thisArg = arguments[1], arg1 = Array.prototype.slice.call(arguments, 2)
  if (typeof fn !== 'function') throw new TypeError('fn must be a function');
  return function () {
    const args = arg1.concat(Array.prototype.slice.call(arguments))
    return fn.call(thisArg, args)
  }
}

Function.prototype.myBind = function () {
  const fn = this;
  const thisArg = arguments[0]
  const arg1 = Array.prototype.slice.call(arguments, 1)

  if (typeof fn !== 'function') throw new TypeError('fn must be a function');
  return function () {
    const args = arg1.concat(Array.prototype.slice.call(arguments))
    return fn.call(thisArg, args)
  }
}

function greet(...skills) {
  console.log(`hello ${this.name}`)
  console.log(`i can ${skills}`)
}

const person = {
  name: 'wenjiang'
}

const boundGreet = bind(greet, person, 'sleep', 'eat')
boundGreet('cry')

const anotherGreet = anotherBind(greet, person, 'sleep', 'eat')
// anotherGreet()

const prototypeBind = greet.myBind(person, 'coding', 'running')
// prototypeBind('listening')