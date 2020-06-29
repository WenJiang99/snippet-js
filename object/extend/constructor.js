function SuperType(color) {
  this.value = 1;
  this.data = [1, 2, 3]
  this.color = color;
  this.getData = function () {
    return this.data;
  }
}
SuperType.prototype.getValue = function () {
  return this.value;
}
SuperType.prototype.age = 18;

function SubType(color) {
  SuperType.call(this, color)
  this.subValue = 2;
}

const instance = new SubType('red');

// console.log(instance.getValue()) // error!
console.log(instance.getData()) // [1,2,3]
console.log(instance.age) // undefined

console.log(instance.__proto__ === SubType.prototype) // true
console.log(instance.__proto__.__proto__ === SuperType.prototype) // false

console.log(instance instanceof SubType) // true
console.log(instance instanceof SuperType) // false
console.log(instance instanceof Object) // true

const instance2 = new SubType('white')
console.log(instance2.data) // [1,2,3]
instance.data.push(4)
console.log(instance2.data) // [1,2,3]

console.log(instance.color, instance2.color) // red , white