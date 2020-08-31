function flatten(arr) {
  return _flatten(arr)
}
function _flatten(arr, result, depth = Infinity) {
  let i = -1;
  result || (result = []);
  depth = (depth == null) ? Infinity : depth;
  while (++i < arr.length) {
    const item = arr[i];
    if (depth > 0 && isArray(item)) {
      _flatten(item, result, depth - 1)
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
console.log(flatten(sample))