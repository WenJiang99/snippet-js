const { isObject, isArray, isFunction } = require("../../utils/is");
const test = require('./test')

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

test(deepClone)