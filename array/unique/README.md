# Javascript 数组去重

## 集合`Set`去重

通过`Set` 数据结构的去重特性来进行数组去重，再把 `Set` 转换成数组

```js
function uniqueArr(arr){
  return Array.from(new Set(arr))
}
```

上面这种方法对于基本类型的数据 `number`,`string`,`boolean`,`undefined`,`null` 都可以正常去重，`NaN` 值也可以去重

但是对于`Object` ， `Array` 等引用类型，只有在引用相同的时候才可以去重，仅仅是值相同的时候，是不能去重的

## `indexOf` 方法

先通过 `indexOf` 检查一下数组中是否已经有这个元素了，只有在*数组中还没有这个元素*  的时候才把这个元素添加到数组中

```js
function uniqueArrByIndexOf(arr = []) {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) === -1) {
      result.push(arr[i])
    }
  }
  return result
}
```

`indexOf` 去重的方法，对于`number`,`string`,`boolean`,`undefined`,`null` 五种基本数据类型也可以正常去重，`NaN` 值不能去重

对于引用类型，同样需要引用相同才能去重，而不是值相同。



## `key` 唯一性去重

```js
function uniqueArrByKey(arr = []) {
  const itemMap = new Map()
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (!itemMap.has(item)) {
      result.push(item)
    }
    itemMap.set(item, true)
  }
  return result;
}
```

通过 *键值对* 类型的数据结构，以元素为键，通过 *键的唯一性* 来去重。具体的键值对类型数据结构，可以是 `Object` 或者是 `Map` 

这种方法，对于五种基本数据类型（不考虑`Symbol`），都可以正常去重，对于应用类型，同样去重去的是 *引用重复* 而不是 *值重复*

### 字符串的`key`

以元素为`key` 的话，还会涉及到一些有趣的地方。上面的方法是通过 `Map` 来做键值对存储的，`Map` 是可以以`Object` 来做键的，不需要把元素转换成字符串。

但是如果是以`Object` 类型来做键值对存储的话，`Object` 的键是`string` 类型的，如果定义的键不是字符串类型，则会自动先调用变量上的`toString` 方法转换成字符串，然后作为键值。

这样对于符合类型，例如`const o1 = {a:1,b:2};const o2 = {a:1,b:3}` 转换成字符串后得到的都是 `[Object,Object]` ，因此键是相同的，就会被认为是重复元素被除掉，即使引用不相同，值也不相同。

```js
function uniqueArrByObjectKey(arr = []) {
  const obj = {}
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (!obj.hasOwnProperty(item)) {
      result.push(item)
    }
    Object.defineProperty(obj, item, { value: true, enumerable: true })
  }
  return result;
}

const obj = { a: 1, b: 2 }

const uniqueArr = uniqueArrByObjectKey;
const sample = [
  1, 2, 3, 2, 1,
  '1', '1',
  true, true, false, false,
  [1, 2, 3], [1, 2, 3], [1, 2, 3, 4],
  { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 3 },
  {}, {},
  [], [],
  NaN, NaN,
  undefined, undefined,
  null, null,
  obj, obj
]

console.log(uniqueArr(sample))

```

得到的去重后的结果是：

```js
[
  1,
  2,
  3,
  true,
  false,
  [ 1, 2, 3 ],
  [ 1, 2, 3, 4],
  { a: 1, b: 2 },
  [],
  NaN,
  undefined,
  null
]
```

上面的结果中应该注意到，数组本质也是一个`Object` 但是`Array` 上部署的`toString` 方法和`Object` 上的`toString` 不一样，数组的`toString` 相当于就是把两个方括号去掉后得到的字符串，所以数组并没有像`Object` 那样只留下一个



## 基于值相同的引用类型去重

想到的第一个方法就是`JSON.stringfy`，把引用类型转换成字符串，然后变成`string` 类型数据去重，去重后再`JSON.parse` 得到原本的数据

但是这个方法也不是完全正确的，具体原因在于`JSON.stringfy` 转换时候的一些限制

```js
function uniqueArrByKey(arr = []) {
  const itemMap = new Map()
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    const k = JSON.stringify(item)
    if (!itemMap.has(k)) {
      result.push(item)
    }
    itemMap.set(k, true)
  }
  return result;
}
```

但是，我个人觉得基于值相同的引用类型去重似乎也没有很多的应用场景。