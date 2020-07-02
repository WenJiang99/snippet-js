# Javascript 类型判断

## typeof方法

```js
function getType(value) {
  return typeof value;
}
```

`typeof` 方法可以判断`number` 、`string` 、`boolean` 、`undefined` 、`symbol` 、 `object` 、`function` 、`bigint` 八种类型

但是对于`Array` 、 `null` ，返回的类型都是`object` 



## instanceof方法

`instanceof` 方法用于判断某个实例是否是某个构造器的实例，而不是返回某个值的类型。

`value instanceof Ctor`

对于基本的数据类型，需要通过 `new` 方式创建才能正确判断。

### 原理

`instanceof` 是通过在*原型链* 上一个一个的查找，`Ctor` 的原型对象是否在`instance` 的原型链上。查找的过程会一直沿着原型链往上找，直到原型对象为`null` 才停止，如果整个原型链上都没找到 `Ctor` 的原型对象，则认为`instance` 不是`Ctor` 的实例

### 原理实现

我们可以自己尝试实现 `instanceof` ，只需要对`instance`的原型链进行遍历，直到原型链顶端，如果都没找到，则返回`false`

```js
function myInstanceof(instance, ctor) {
  if (
    (instance === null || instance === undefined) ||
    (ctor === null || ctor === undefined)
  ) {
    return false
  }
  const prototype = ctor.prototype;
  let proto = instance.__proto__
  while (1) {
    if (proto === null || proto === undefined) {
      return false;
    }
    if (proto === prototype) {
      return true;
    }
    proto = proto.__proto__
  }
}
```



## toString

`Object.prototype.toString.call(value)`

在任意值上调用`Object`原生的`toString` 方法，都会返回一个`[object NativeConstructorName]` 格式的字符串。

每个类在内部都有一个`[[Class]]` 属性，指定了对应的`NativeContructorName` 是什么。

```js
function byObjectToString(value, type) {
  return Object.prototype.toString.call(value) === type;
}


function toTag(ctor) {
  return `[object ${ctor}]`
}
const ARRAY_TAG = toTag('Array')
const OBJECT_TAG = toTag('Object')
const REGEXP_TAG = toTag('RegExp')
const FUNCTION_TAG = toTag('Function')
const NUMBER_TAG = toTag('Number')
const STRING_TAG = toTag('String')
// ... 
```



