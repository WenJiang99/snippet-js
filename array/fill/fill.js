function fill(arr, value, start, end) {
  const length = arr.length;
  if (!length) return [];
  start = start ? formatIndex(start, length) : 0
  end = end ? formatIndex(end, length) : length;
  if (start > end) return arr;
  for (let i = start; i < end; i++) {
    arr[i] = value;
  }
  return arr;
}

function formatIndex(index, length) {
  index = ~~index;
  return index > -1 ? Math.min(index, length - 1) : Math.max(length + index, 0)
}

function test(cb, ...args) {
  console.log(cb(...args))
}
const arr = [1, 2, 3, 4, 5, 6]
test(fill, arr, 'a', 1, 5)
test(fill, arr, 'b', 1, 3)