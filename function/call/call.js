Function.prototype.myCall = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError(`${this} is not a function`)
  }
  if (typeof context === 'object') {
    context = context || window;
  } else {
    context = Object.create(null)
  }
  const args = [...arguments].slice(1)
  const fn = Symbol('fn');
  context[fn] = this;
  const result = context[fn](...args)
  delete context[fn]
  return result;
}

function myCall(fn, context, ...args) {
  if (typeof fn !== 'function') {
    throw new TypeError(`fn is not a function`)
  }
  if (typeof context === 'object') {
    context = context || window;
  } else {
    context = Object.create(null)
  }
  const key = Symbol('key');
  context[key] = fn;
  const result = context[key](...args)
  delete context[key]
  return result;
}

Function.prototype.myApply = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError(`${this} is not a function`)
  }
  if (typeof context === 'object') {
    context = context || window;
  } else {
    context = Object.create(null)
  }
  const args = [...arguments].slice(1)
  const key = Symbol('key')
  context[key] = this;
  const result = context[key](args)
  delete context[key]
  return result
}

function greet() {
  return this.name;
}

const person = {
  name: 'wenjiang'
}

console.log(greet.myCall(person))
console.log(myCall(greet, person))
