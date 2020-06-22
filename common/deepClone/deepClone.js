const { isObject, isArray, isFunction } = require("../../utils/is");

function deepClone(value) {
  if (!isObject(value)) return value;
  if (isArray(value)) {
    return cloneArray(value)
  } else {
    return cloneObject(value)
  }
}

function cloneArray(source) {
  let index = -1,
    length = source.length;
  const result = Array(length)
  while (++index < length) {
    const value = source[index]
    result[index] = cloneItem(value)
  }
  return result;
}

function cloneObject(source, result) {
  result || (result = {});
  const keys = getAllKeys(source, true);
  let i = -1;
  while (++i < keys.length) {
    const value = source[keys[i]];
    result[keys[i]] = cloneItem(value)
  }
  return result;
}

function cloneItem(value) {
  return isObject(value)
    ? isArray(value)
      ? cloneArray(value)
      : isFunction(value)
        ? value
        : cloneObject(value)
    : value;
}

function getAllKeys(obj, symbolKeys = true) {
  const keys = []
  for (let k in Object(obj)) {
    keys.push(k)
  }
  if (symbolKeys) {
    const symKeys = Object.getOwnPropertySymbols(obj);
    for (let i = 0; i < symKeys.length; i++) {
      keys.push(symKeys[i])
    }
  }
  return keys;
}

function jsonClone(value, replacer, space) {
  return JSON.parse(JSON.stringify(value, replacer, space))
}



const p1 = {
  name: 'leborn',
  age: 34,
}
const p2 = {
  name: 'davis',
  age: 28,
}
const team = {
  team: 'lakers',
  players: [
    p1,
    p2
  ]
}

const obj = {
  greet: function (name) {
    console.log(`hello ${name}`)
  },
  [Symbol('name')]: 'myname',
  age: NaN,
  salary: Infinity,
  slogan: undefined,
  job: '996',
  team
}

function test(cb, obj, ...args) {
  const result = cb(obj, ...args)
  console.log('Source:', obj)
  console.log('Clone:', result)
  console.log(`Source === Clone : ${result === obj}`)
  console.log(`Source#team === Clone#team : ${result.team === obj.team}`)
  console.log(`Source#team#players === Clone#team#players : ${result.team.players === obj.team.players}`)
  console.log(`Source#team#players[0] === Clone#team#players[0] : ${result.team.players[0] === obj.team.players[0]}`)

}

test(deepClone, obj)