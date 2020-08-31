# 千分位格式化

## 正则写法

### 思路分析

通过正则表达式去匹配到后面有若干对*3个一组*的数字，然后将匹配到的数字替换成`$1,`，即在原来的基础上添加一个逗号，实现千分位分割

正则表达式`/(\d)(?=(?:\d{3})+/`是一个后向断言的匹配，其中`/(?=(?:\d{3})+/`是指后面跟着有若干个`(\d{3})`的数字，例如`12345678`中的`5`和`2`

`?:`是指当前组是一个非捕获组，能够匹配到，但是不会记住这个组

`(\.\d+)?$`表达式是指后面可以带有小数点，也可以不带有

将匹配到的满足千分位分割的位置上的数字，替换成`$1,`，其中`$1`表示的是原来的正则表达式中的第一个分组匹配到的结果

### 实现

```js
// (?=(?:\d{3})+) 匹配的是后面的连续的三个数字
// (\.\d+)? 可以匹配到小数点后面的数字部分，并且可有可无

/**
 * 
 * @param {number} num 
 * @param {boolean} floatFormat 是否要对小数点后面的数字进行千分位格式化
 */
function formatByRegExp(num, floatFormat = false) {
  num = String(num)
  const reg = floatFormat
    ? /(\d)(?=(?:\d{3})+(\.\d+)?$)/g
    : /(\d)(?=(?:\d{3})+(\.\d+)$)/g
  return num.replace(reg, '$1,')
}
```

## 循环写法

### 思路分析

通过一个循环，从数字的最后面开始遍历（如果是有小数点，就从小数点前面的一个数字开始遍历），通过一个位置标记`index`来标记遍历的次数，以及用一个字符串`res`来存放处理的结果，当`index % 3 === 0`的时候，就正好是千分位分割的位置，因此在这里插入一个逗号。而其他位置，直接将对应位置的字符放到结果字符串中即可

因为还要考虑到最开始的一个位置不需要放逗号，所以判断是否放逗号的条件是`index % 3 === 0 && index !== 0`

因为是从字符串后面开始，往前遍历的，所以结果字符串`res`中得到的是一个逆序的结果，在返回前需要对其翻转一下。

同时还要考虑到小数点部分也需要添加到结果字符串中一起返回，也即是`  return res.split('').reverse().join('') + str.slice(dotIndex)`

### 实现

```js
function formatByLoop(num, n = 3) {
  const str = String(num)
  let res = '', index = 0;
  const dotIndex = str.indexOf('.')
  let len = (dotIndex > -1 ? dotIndex : str.length) - 1;
  while (len >= 0) {
    if (index % n === 0 && index !== 0) {
      res += ',';
    }
    res += str[len]
    index++;
    len--;
  }
  return res.split('').reverse().join('') + str.slice(dotIndex)
}
```

