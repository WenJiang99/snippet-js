function baseChunk(arr, size) {
  if (!Array.isArray(arr)) {
    return arr;
  }
  size = ~~size;
  const result = []
  let group = -1;
  for (let i = 0; i < arr.length; i++) {
    const groupIndex = i % size;
    if (groupIndex === 0) {
      group++;
      result[group] = result[group] || []
    }
    result[group][groupIndex] = arr[i]
  }
  return result;
}


function test(cb, ...args) {
  const res = cb(...args)
  console.log(res)
}

const sample = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
test(baseChunk, sample, 3)
