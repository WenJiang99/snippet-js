function getType(value) {
  return typeof value;
}

function byTypeOf(value, type) {
  return typeof value === type;
}

function byInstanceOf(value, proto) {
  return value instanceof proto;
}

function byObjectToString(value, type) {
  return Object.prototype.toString.call(value) === type;
}


function toTag(ctor) {
  return `[object ${ctor}]`
}
const ARRAY_TAG = toTag('Array')
const OBJECT_TAG = toTag('Object')
const REGEXP_TAG = toTag('RegExp')
const FUNCTION_TAG = toTag('Function')
const NUMBER_TAG = toTag('Number')
const STRING_TAG = toTag('String')

const log = console.log;
log(byTypeOf(1, 'number')) // true
log(byInstanceOf(1, Number)) // false
log(byInstanceOf(new Number(1), Number)) // true
log(byObjectToString(1, NUMBER_TAG)) // true
