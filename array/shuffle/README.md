# Javascript 数组shuffle

##  快速乱序算法

从数组第一个元素开始进行遍历，每次将当前元素和其后面的一个随机的元素来交换。

```js
function getRandom(min, max, isInt) {
  return isInt
    ? Math.floor(Math.random() * (max - min) + min)
    : Math.random() * (max - min) + min
}

function shuffle(arr) {
  let index = 0;
  const len = Array.isArray(arr) ? arr.length : 0;
  if (!len) {
    return [];
  }
  const result = JSON.parse(JSON.stringify(arr))
  while (index < len) {
    const rand = index + getRandom(0, len - index, true);
    const value = result[rand];
    result[rand] = result[index];
    result[index] = value;
    index++;
  }
  return result;
}
```

## Fisher-Yates 洗牌算法

其实和上面的方法基本一样，但是只是改成了从数组最后一个元素开始，往前进行随机交换。

```js

function shuffleFisherYates(arr = []) {
  const result = []
  let i = 0;
  while (i < arr.length) {
    result[i] = arr[i]
    i++;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const rand = getRandom(0, i + 1, true)
    const value = result[rand];
    result[rand] = result[i]
    result[i] = value;
  }
  return result;
}
```

## 检验乱序是否均匀

通过记录每次乱序后，每个元素在乱序后的数组中的索引位置的次数，来查看数组是否乱序均匀。

```js
/**
 * 记录每个元素出现在乱序后的位置索引的次数统计,检验排序结果是否达到基本均匀乱序的效果
 * @param {*} arr 测试的数组
 * @param {*} cb 乱序算法
 * @param {*} count 测试的次数
 */
function test(arr, cb, count) {
  const itemIndexObj = {}
  for (let i = 0; i < count; i++) {
    countItemIndex(cb(arr), itemIndexObj)
  }
  console.log(cb)
  console.log(itemIndexObj)
}

function countItemIndex(arr = [], countObj = {}) {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    const k = `item_${item}`;
    countObj[k] = countObj[k] || Array.from({ length: arr.length }).fill(0)
    countObj[k][i] += 1;
  }
}
```

如果乱序足够均匀的话，每个元素出现在不同的索引上的次数应该大致相同或者接近的。

```
[Function: fastShuffle]
{
  item_3: [
    12405, 12461,
    12454, 12590,
    12464, 12616,
    12358, 12652
  ],
  item_1: [
    12467, 12417,
    12416, 12540,
    12591, 12531,
    12649, 12389
  ],
  item_5: [
    12500, 12482,
    12508, 12404,
    12686, 12371,
    12513, 12536
  ],
  item_2: [
    12674, 12382,
    12537, 12505,
    12350, 12546,
    12465, 12541
  ],
  item_6: [
    12486, 12479,
    12451, 12618,
    12487, 12500,
    12458, 12521
  ],
  item_8: [
    12368, 12705,
    12441, 12445,
    12591, 12468,
    12587, 12395
  ],
  item_4: [
    12683, 12454,
    12522, 12419,
    12494, 12540,
    12395, 12493
  ],
  item_7: [
    12417, 12620,
    12671, 12479,
    12337, 12428,
    12575, 12473
  ]
}

[Function: shuffleFisherYates]
{
  item_2: [
    12502, 12464,
    12580, 12481,
    12445, 12473,
    12483, 12572
  ],
  item_5: [
    12638, 12432,
    12465, 12590,
    12361, 12436,
    12680, 12398
  ],
  item_8: [
    12542, 12469,
    12537, 12521,
    12391, 12511,
    12387, 12642
  ],
  item_6: [
    12491, 12597,
    12481, 12435,
    12542, 12450,
    12379, 12625
  ],
  item_7: [
    12389, 12562,
    12589, 12617,
    12396, 12447,
    12460, 12540
  ],
  item_3: [
    12385, 12706,
    12425, 12329,
    12707, 12506,
    12476, 12466
  ],
  item_4: [
    12307, 12439,
    12439, 12612,
    12706, 12646,
    12554, 12297
  ],
  item_1: [
    12746, 12331,
    12484, 12415,
    12452, 12531,
    12581, 12460
  ]
}
```

