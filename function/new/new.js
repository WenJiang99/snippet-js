function create(ctor, ...args) {
  if (!ctor.prototype) {
    throw new Error(`ctor must be a Contructor.`)
  }
  const obj = {};
  Object.setPrototypeOf(obj, ctor.prototype) // obj.__proto__ = ctor.prototype
  const result = ctor.call(obj, ...args)
  if (result && (typeof result === 'object' || typeof result === 'function')) {
    return result
  }
  return obj;
}

function BaseCtor(name, age) {
  this.name = name;
  this.age = age;
}

function AnotherCtor(name, age) {
  this.name = name;
  this.age = age;
  return {
    job: '996'
  }
}

const instance = new BaseCtor('wenjiang', 3)
const instance2 = create(BaseCtor, 'wenjiang', 3)
console.log(instance.name, instance.age) // wenjiang 3
console.log(instance2.name, instance2.age) // wenjiang 3

const instance3 = new AnotherCtor('wenjiang', 3)
const instance4 = create(AnotherCtor, 'wenjiang', 3)

console.log(instance3.name, instance3.age, instance3.job) // undefined undefined 996
console.log(instance4.name, instance4.age, instance4.job) // undefined undefined 996