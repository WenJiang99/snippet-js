
# Javascript 数组拼接 Concat

## Description

在一个数组上拼接多个子元素或数组，得到一个拼接后的数组

## 循环

```js
/**
 * 在一个数组 `origin`上拼接元素
 * @param {Array} origin 要拼接的原数组
 * @param {Boolean} deep 是否递归遍历拼接项内部的子数组
 * @param  {...any} extras 拼接项列表
 */
function concat(origin, deep, ...extras) {
  const result = []
  for (let i = 0; i < origin.length; i++) {
    result.push(origin[i])
  }
  for (let i = 0; i < extras.length; i++) {
    simpleConcat(result, extras[i], deep)
  }
  return result;
}

function simpleConcat(origin, data, deep = false) {
  if (Array.isArray(data)) {
    for (let j = 0; j < data.length; j++) {
      if (deep) {
        simpleConcat(origin, data[j], deep)
      } else {
        origin.push(data[j])
      }
    }
  } else origin.push(data);
  return origin;
}
```



### examples

```js
function test(cb, ...args) {
  console.log(cb(...args))
}

const origin = ['a', 'b', 'c', ['d', 'e']]
test(concat, origin, false, 1, 2, [3, 4], [5, 6, [7, 8, [9, 10]]])
test(concat, origin, true, 1, 2, [3, 4], [5, 6, [7, 8, [9, 10]]])
```

```js
[ 'a', 'b', 'c', [ 'd', 'e' ], 1, 2, 3, 4, 5, 6, [ 7, 8, [ 9, 10 ] ] ]
[ 'a', 'b', 'c', [ 'd', 'e' ], 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
```

