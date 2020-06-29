function SuperType(color) {
  this.value = 1;
  this.data = [1, 2, 3]
  this.color = color;
}
SuperType.prototype.getValue = function () {
  return this.value;
}
SuperType.prototype.getData = function () {
  return this.data;
}

function SubType() {
  this.subValue = 2;
}

SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function () {
  return this.subValue;
}

const instance = new SubType();
console.log(instance.getValue()) // 1
console.log(instance.__proto__ === SubType.prototype) // true
console.log(instance.__proto__.__proto__ === SuperType.prototype) // true

console.log(instance instanceof SubType) // true
console.log(instance instanceof SuperType) // true
console.log(instance instanceof Object) // true

const instance2 = new SubType()
console.log(instance2.data) // [1,2,3]
instance.data.push(4)
console.log(instance2.data) // [1,2,3,4]

