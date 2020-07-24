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

const sample = [
  1, 2, 3,
  [4, 5, [6, 7, [8, 9], 10], 11],
  12
]
console.log(flatten(sample, []))