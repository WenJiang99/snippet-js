/**
 * 不能去除Object类型的重复元素，可以去除 NaN,undefined
 * @param {*} arr 
 */
function uniqueArrBySet(arr = []) {
  return Array.from(new Set(arr))
}

/**
 * 不能去除Object类型元素重复，不可以去除NaN的重复
 * @param {*} arr 
 */
function uniqueArrByIndexOf(arr = []) {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) === -1) {
      result.push(arr[i])
    }
  }
  return result
}

function uniqueArrByKey(arr = []) {
  const itemMap = new Map()
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (!itemMap.has(item)) {
      result.push(item)
    }
    itemMap.set(item, true)
  }
  return result;
}

function uniqueArrByObjectKey(arr = []) {
  const obj = {}
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (!obj.hasOwnProperty(item)) {
      result.push(item)
    }
    Object.defineProperty(obj, item, { value: true, enumerable: true })
  }
  return result;
}

const obj = { a: 1, b: 2 }

const uniqueArr = uniqueArrByObjectKey;
const sample = [
  1, 2, 3, 2, 1,
  '1', '1',
  true, true, false, false,
  [1, 2, 3], [1, 2, 3], [1, 2, 3, 4],
  { a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 3 },
  {}, {},
  [], [],
  NaN, NaN,
  undefined, undefined,
  null, null,
  obj, obj
]

console.log(uniqueArr(sample))
console.log('' + { a: 1, b: 2 } + '__' + { a: 1, b: 3 } + '__' + [1, 2, 3] + '__' + [])