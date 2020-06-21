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

function test(cb, expected, ...args) {
  console.log(`result:`, cb(...args), `expected:`, expected)
}

const numberSample = [1, 2, 3, 4, 5, 4, 3, 2, 1]

test(findIndex, 1, numberSample, 2)
test(findIndex, 7, numberSample, 2, 2)

const objSample = [
  {
    name: 'wenjiang',
    age: 21
  },
  {

    name: 'leborn',
    age: 35
  },
  {
    name: 'davis',
    age: 28
  },
  {
    name: 'wenjiang',
    age: 12
  },
  {

    name: 'leborn',
    age: 53
  },
]

test(findIndex, 1, objSample, item => item.name === 'leborn')
test(findIndex, 3, objSample, item => item.age === 12)
test(findIndex, 2, objSample, { name: 'davis', age: 28 })
test(findIndex, -1, objSample, { name: 'leborn', age: 28 })
test(findIndex, 4, objSample, ['age', 53])
test(findIndex, 0, objSample, ['name', 'wenjiang'])