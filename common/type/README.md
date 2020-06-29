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

