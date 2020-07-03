# Javascript 函数绑定

## 函数绑定规则

### 默认绑定

默认绑定到调用栈的前一个上下文

### 隐式绑定

// todo

### 显式绑定

显式地通过一些特殊函数来指定函数调用时候的`this` 的指向

// todo

### `new` 绑定

*JavaScript* 中的*构造函数* ，只是通过`new` 操作符来调用的函数。这些所谓*构造函数* 并不会属于某个类，也不会实例化一个类。

实际上，它们甚至都不能说是一种特殊的函数类型，只是被`new`操作符调用的普通函数而已，这种函数调用叫做***构造函数调用***。

实际上并不存在所谓的*构造函数* ，只有函数的*构造调用*

- 创建（构造）一个全新的对象`obj`
- 新对象会被执行***原型链接***
- 新对象会绑定到函数调用的`this`，也即作为构造函数调用的`this`
- 如果函数没有返回其他对象，则`new`表达式中的函数调用会自动返回这个新对象



### 绑定优先级

总结来说，判断一个函数调用中的`this`的指向，可以按照下面的顺序来分析

- 查看函数是否在`new` 中调用，即是否是通过`new`绑定，如果是`new`绑定的话，则this指向的是新创建的对象
- 查看函数是否通过`call`、`apply` 进行了显式绑定或者是硬绑定，如果有的话，则`this`指向的是显式绑定的`thisArg`
- 查看函数是否是在某个*上下文* 对象中调用，也即是否存在隐式绑定，如果存在隐式绑定，则`this`绑定在对应的上下文对象
- 以上三个情况都不存在，则是通过*默认绑定* 的方式，如果在严格模式，则是`undefined`，在非严格模式下，则绑定到了全局对象



## bind

### 函数式写法

一个简单版的`bind` 函数实现如下

```js
function bind(fn, thisArg, ...arg1) {
  if (typeof fn !== 'function') throw new TypeError('fn must be a function');
  return function (...arg2) {
    return fn.call(thisArg, ...arg1.concat(arg2))
  }
}
```

对于参数的处理，也可以通过`arguments` 变量来处理

```js
function anotherBind() {
  const fn = arguments[0], thisArg = arguments[1], arg1 = Array.prototype.slice.call(arguments, 2)
  if (typeof fn !== 'function') throw new TypeError('fn must be a function');
  return function () {
    const args = arg1.concat(Array.prototype.slice.call(arguments))
    return fn.call(thisArg, args)
  }
}
```

### Function.prototype

如果是要添加到`Function.prototype` 上，在`Function.prototype` 内的`this` ，就是指向了当前的函数实例（要调用的函数），因此只需要把上面函数式写法的 `fn` 参数，改成内部的 `this` 即可。

```js
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
```



## call

### 函数式写法

```js
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
```

第一个参数 `fn` 就是要绑定的函数，第二个参数就是要绑定的上下文，后面是函数的参数

`call` 函数是要把`fn` 的执行上下文绑定到给定的`context` 参数上。通过把函数作为指定的上下文对象的一个属性的方式来调用，就可以使得在调用函数`context[key]`的时候，`this` 指向了 `context`

对于`typeof context === 'object'` 的判断，是考虑到传入的上下文是基本数据类型的情况，需要转换成一个`object`

### Function.prototype

```js
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
```

## apply

`apply`函数原理和`call` 函数基本相同，除了在函数调用传入的参数类型，`apply`函数传入的是一个数组。

```js
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
```

## new

前面已经提到了 `new` 操作符的绑定规则

*JavaScript* 中的*构造函数* ，只是通过`new` 操作符来调用的函数。这些所谓*构造函数* 并不会属于某个类，也不会实例化一个类。

实际上，它们甚至都不能说是一种特殊的函数类型，只是被`new`操作符调用的普通函数而已，这种函数调用叫做***构造函数调用***。

实际上并不存在所谓的*构造函数* ，只有函数的*构造调用*

`new` 操作过程会执行的步骤：

- 创建（构造）一个全新的对象`obj`
- 新对象会被执行***原型链接***
- 新对象会绑定到函数调用的`this`，也即作为构造函数调用的`this`
- 如果函数没有返回其他***Object***，则`new`表达式中的函数调用会自动返回这个新对象

通过上面的描述，我们可以自己实现一个`new` 操作，将上面四个步骤转换成代码

```js
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
```

其中原型链接和`this`绑定通过下面的两句代码实现：

```js
  Object.setPrototypeOf(obj, ctor.prototype) // obj.__proto__ = ctor.prototype
  const result = ctor.call(obj, ...args)
```

测试：

```js

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
```

