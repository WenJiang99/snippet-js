const Promise = require('./promise')

function promiseAll() {
  var promise1 = new Promise((resolve, reject) => {
    resolve(3);
  })
  var promise2 = 42;
  var promise3 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, 'foo');
  });

  Promise.all([promise1, promise2, promise3]).then(function (values) {
    console.log('values:', values); //[3, 42, 'foo']
  }, (err) => {
    console.log(err)
  });

  var p = Promise.all([]); // will be immediately resolved
  var p2 = Promise.all([1337, "hi"]); // non-promise values will be ignored, but the evaluation will be done asynchronously
  console.log('[ ]', p);
  console.log('p2:', p2)
  setTimeout(function () {
    console.log('the stack is now empty');
    console.log('setTimeout p2:', p2);
  });
}

function promiseRace() {
  Promise.race([
    new Promise((resolve, reject) => { setTimeout(() => { resolve(1000) }, 1000) }),
    undefined,
    new Promise((resolve, reject) => { setTimeout(() => { reject(100) }, 100) })
  ]).then((data) => {
    console.log('race1 data: ', data);
  }, (err) => {
    console.log('race1 err: ', err);
  });

  Promise.race([
    new Promise((resolve, reject) => { setTimeout(() => { resolve(1000) }, 1000) }),
    new Promise((resolve, reject) => { setTimeout(() => { resolve(200) }, 200) }),
    new Promise((resolve, reject) => { setTimeout(() => { reject(100) }, 100) })
  ]).then((data) => {
    console.log(`race2 data:`, data);
  }, (err) => {
    console.log(`race2 err:`, err);
  });
}

promiseAll()
promiseRace()