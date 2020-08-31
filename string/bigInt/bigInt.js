function add(num1, num2) {
  if (
    isNaN(Number(num1)) || isNaN(Number(num2))
  ) {
    throw new TypeError(`num1 and num2 should all be converted into a number`)
  }
  num1 = String(num1)
  num2 = String(num2)
  const chars1 = num1.split('').reverse()
  const chars2 = num2.split('').reverse()
  let extra = 0;
  let result = []
  let i = -1;
  const len1 = chars1.length, len2 = chars2.length;
  while (++i < Math.max(len1, len2)) {
    const sum = getValue(chars1, i, len1) + getValue(chars2, i, len2) + extra;
    result.push(sum % 10)
    extra = sum > 10 ? 1 : 0;
  }
  if (extra !== 0) {
    result.push(extra)
  }
  return result.reverse().join('')
}

function getValue(chars, index, len) {
  return index >= len
    ? 0
    : Number(chars[index])
}

console.log(add('2111111111111111111', '1111111111111111111')) // 222222222222222222
console.log(2111111111111111111 + 1111111111111111111) // 222222222222222230