function getRandom(min, max, isInt) {
  return isInt
    ? Math.floor(Math.random() * (max - min) + min)
    : Math.random() * (max - min) + min
}

function fastShuffle(arr) {
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

const sample = [1, 2, 3, 4, 5, 6, 7, 8];
test(sample, fastShuffle, 100000)
test(sample, shuffleFisherYates, 100000)