# Javascript Array findIndex

## 元素查找

具体的描述，可以查看[lodash文档-findIndex](https://www.lodashjs.com/docs/lodash.findIndex)，这里是对这个功能的一个基础实现。

## 代码实现

```js
const NOT_FOUND = -1;
function findIndex(arr, predicate, fromIndex = 0) {
  const length = arr.length;
  if (!length) return NOT_FOUND;
  fromIndex = formatIndex(fromIndex, length)
  for (let i = fromIndex; i < length; i++) {
    if (getPredication(arr[i], i, arr, predicate)) {
      return i;
    }
  }
  return NOT_FOUND;
}

function getPredication(data, index, arr, predicate) {
  switch (typeof predicate) {
    case 'function': {
      return predicate(data, index, arr)
    }
    case 'object': {
      if (Array.isArray(predicate)) {
        return propertyMatch(data, predicate[0], predicate[1])
      } else {
        return propertiesMatch(data, predicate)
      }
    }
    default: {
      return data === predicate;
    }
  }
}


function formatIndex(index, length) {
  index = ~~index;
  return index > -1 ? Math.min(index, length - 1) : Math.max(length + index, 0)
}

function propertiesMatch(target, filter) {
  if (!target || !filter) return false;
  for (let k in filter) {
    if (!propertyMatch(target, k, filter[k])) {
      return false;
    }
  }
  return true;
}

function propertyMatch(target, k, value) {
  return target[k] === value;
}

```

`predicate` 参数可以是`function`、`object`、`array` 或者是其他可以直接通过`===` 来判断是否相等的基本数据类型

如果是`function` 则返回值会作为是否查找成功的依据，当函数返回值为`true` 意味着当前元素就是要找的元素

如果是`object` ，相当于是一组匹配条件，当某个元素满足了全部条件时，认为该元素就是要查找的元素

如果是`array`，则数组应该是 `[key,value]` 的一个含有两个元素的数组，相当于`{key:value}`

其他类型，将会直接比较值是否相同来判定是否为要查找的元素
