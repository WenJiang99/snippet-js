const test = require('./test')
const isArray = v => Array.isArray(v)
function deepCloneByDFS(value, visited = []) {
  const type = typeof value;
  let result;
  if (type === 'object') {
    const index = visited.indexOf(value)
    result = isArray(value) ? [] : {};
    if (index > -1) {
      result = visited[index]
    } else {
      visited.push(value)
      for (let item in value) {
        result[item] = deepCloneByDFS(value[item], visited)
      }
    }

  } else if (type === 'function') {
    result = eval(`(${value.toString()})`)
  } else result = value;
  return result;
}

test(deepCloneByDFS)