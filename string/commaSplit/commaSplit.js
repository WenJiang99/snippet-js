// (?=(?:\d{3})+) 匹配的是后面的连续的三个数字
// (\.\d+)? 可以匹配到小数点后面的数字部分，并且可有可无

/**
 * 
 * @param {number} num 
 * @param {boolean} floatFormat 是否要对小数点后面的数字进行千分位格式化
 */
function formatByRegExp(num, floatFormat = false) {
  num = String(num)
  const reg = floatFormat
    ? /(\d)(?=(?:\d{3})+(\.\d+)?$)/g
    : /(\d)(?=(?:\d{3})+(\.\d+)$)/g
  return num.replace(reg, '$1,')
}

function formatByLoop(num, n = 3) {
  const str = String(num)
  let res = '', index = 0;
  const dotIndex = str.indexOf('.')
  let len = (dotIndex > -1 ? dotIndex : str.length) - 1;
  while (len >= 0) {
    if (index % n === 0 && index !== 0) {
      res += ',';
    }
    res += str[len]
    index++;
    len--;
  }
  return res.split('').reverse().join('') + str.slice(dotIndex)
}

const nums = [
  1234567890.987654321,
  12345678900.0987654321,
  123456789000.00987654321,
]
nums.forEach(num => console.log(formatByRegExp(num)))
nums.forEach(num => console.log(formatByLoop(num)))