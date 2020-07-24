
# 数组平整

## 递归实现

对数组进行遍历，每个元素判断是否是数组类型，如果是数组则递归调用`flatten`函数，传入当前已经平整好的结果`result` 

通过`deep`参数来控制要平整的维度，默认是无穷维。

```js
function flatten(arr, result, deep = Infinity) {
  let i = -1;
  result || (result = []);
  deep = (deep === undefined || deep === null) ? Infinity : deep;
  while (++i < arr.length) {
    const item = arr[i];
    if (deep > 0 && isArray(item)) {
      flatten(item, result, deep - 1)
    } else {
      result.push(item)
    }
  }
  return result;
}

const isArray = arr => Array.isArray(arr)
```

