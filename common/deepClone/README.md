#  Javascript 深拷贝

## 引用类型

`Object` `Array` 在 `Javascript` 或者很多其他语言中都是一种 **引用类型** ，在直接对引用类型进行赋值时候，很多时候都只是对引用的赋值，只是在原值上增加了一个新的引用，而不是对原值的一个拷贝，这种情况下，**原值发生修改后，所有对于原值的引用都会受到影响**，这种赋值形式就是 **浅拷贝**

相对应的，在复制一个引用类型时候，**直接复制了一份新的值，生成一个新的引用**，在原值发生修改时候，就**不会**影响到新的引用了，这种便是 **深拷贝**

## 深拷贝关键

- 新的引用
- 数组、Object 
- 嵌套的引用类型需要递归做深拷贝
- 数组考虑是否通过`RegExp#exec` 生成的数组，具体可查看[MDN-Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)



## `JSON` 方法实现深拷贝

先将一个引用类型的数据进行`JSON.stringfy` 得到一个*JSON* 格式的字符串表示的数据，再通过`JSON.parse` 将*JSON* 字符串解析成原始数据类型的数据。

```js
function jsonClone(value) {
  return JSON.parse(JSON.stringify(value))
}
```

`JSON`方法实现深拷贝，一方面效率不高，另一方面，因为 `JSON.stringfy` 方法在序列化过程中存在一些特定的规则，使得这个方法存在着一些限制。

### 属性名

- 对包含**循环引用**的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
- `Symbol` 键在序列化过程会被忽略
- 其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化**可枚举的属性**

### 属性值

- `undefined`、任意的`Function`以及 `Symbol` 值，在序列化过程中，如果是在非数组对象中，则会被**忽略**，如果是在数组中，则会被转换成 `null`。
- `Function`、`undefined`被单独转换时，会返回 *undefined* 
- `NaN` 和 `Infinity` 格式的数值及 `null` 都会被当做 *null*



对于上面的`jsonClone` 方法，我们调用测试一下：

```js
const obj = {
  greet: function (name) {
    console.log(`hello ${name}`)
  },
  [Symbol('name')]: 'myname',
  age: NaN,
  salary: Infinity,
  slogan: undefined,
  job: '996'
}
console.log(jsonClone(obj))
```

根据上面的规则我们知道，`greet` 属性是个函数，`Symbol('name')` 是个`Symbol` 键，`slogan` 的值是`undefined` ，在序列化时都会被忽略

而`age` 和 `salary` 属性都会被当成`null` 

最后得到输出如下：

```js
{ age: null, salary: null, job: '996' }
```

## 遍历

```js
const { isObject, isArray, isFunction } = require("../../utils/is");

function deepClone(value) {
  if (!isObject(value)) return value;
  if (isArray(value)) {
    return cloneArray(value)
  } else {
    return cloneObject(value)
  }
}

function cloneArray(source) {
  let index = -1,
    length = source.length;
  const result = Array(length)
  while (++index < length) {
    const value = source[index]
    result[index] = cloneItem(value)
  }
  return result;
}

function cloneObject(source, result) {
  result || (result = {});
  const keys = getAllKeys(source, true);
  let i = -1;
  while (++i < keys.length) {
    const value = source[keys[i]];
    result[keys[i]] = cloneItem(value)
  }
  return result;
}

function cloneItem(value) {
  return isObject(value)
    ? isArray(value)
      ? cloneArray(value)
      : isFunction(value)
        ? value
        : cloneObject(value)
    : value;
}

function getAllKeys(obj, symbolKeys = true) {
  const keys = []
  for (let k in Object(obj)) {
    keys.push(k)
  }
  if (symbolKeys) {
    const symKeys = Object.getOwnPropertySymbols(obj);
    for (let i = 0; i < symKeys.length; i++) {
      keys.push(symKeys[i])
    }
  }
  return keys;
}
```

对上面的`deepClone` 函数调用测试，结果如下：

```js
const p1 = {
  name: 'leborn',
  age: 34,
}
const p2 = {
  name: 'davis',
  age: 28,
}
const team = {
  team: 'lakers',
  players: [
    p1,
    p2
  ]
}

const obj = {
  greet: function (name) {
    console.log(`hello ${name}`)
  },
  [Symbol('name')]: 'myname',
  age: NaN,
  salary: Infinity,
  slogan: undefined,
  job: '996',
  team
}

function test(cb, obj, ...args) {
  const result = cb(obj, ...args)
  console.log('Source:', obj)
  console.log('Clone:', result)
  console.log(`Source === Clone : ${result === obj}`)
  console.log(`Source#team === Clone#team : ${result.team === obj.team}`)
  console.log(`Source#team#players === Clone#team#players : ${result.team.players === obj.team.players}`)
  console.log(`Source#team#players[0] === Clone#team#players[0] : ${result.team.players[0] === obj.team.players[0]}`)

}

test(deepClone, obj)
```

```
Source: {
  greet: [Function: greet],
  age: NaN,
  salary: Infinity,
  slogan: undefined,
  job: '996',
  team: { team: 'lakers', players: [ [Object], [Object] ] },
  [Symbol(name)]: 'myname'
}
Clone: {
  greet: [Function: greet],
  age: NaN,
  salary: Infinity,
  slogan: undefined,
  job: '996',
  team: { team: 'lakers', players: [ [Object], [Object] ] },
  [Symbol(name)]: 'myname'
}
Source === Clone : false
Source#team === Clone#team : false
Source#team#players === Clone#team#players : false
Source#team#players[0] === Clone#team#players[0] : false
```

