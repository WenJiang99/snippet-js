function isObject(value) {
  const type = typeof value;
  return !!type && (type === 'object' || type === 'function')
}

function isArray(value) {
  return Array.isArray(value)
}

function isFunction(value){
 return typeof value === 'function'
}

module.exports = {
  isObject,
  isArray,
  isFunction
}