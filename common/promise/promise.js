const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function MyPromise(fn) {
  const that = this;
  that.state = PENDING;
  that.value = null;
  that.resolvedCallbacks = []
  that.rejectedCallbacks = []

  function resolve(value) {
    if (value instanceof MyPromise) {
      return value.then(v => resolve(v), e => reject(e))
    }
    if (that.state === PENDING) {
      that.state = FULFILLED;
      that.value = value;
      that.resolvedCallbacks.forEach(cb => cb(value))
    }
  }
  function reject(value) {
    if (that.state === PENDING) {
      that.state = REJECTED;
      that.value = value;
      that.rejectedCallbacks.forEach(cb => cb(value))
    }
  }
  try {
    fn(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const that = this;
  onFulfilled = typeof onFulfilled === 'function'
    ? onFulfilled
    : value => value;
  onRejected = typeof onRejected === 'function'
    ? onRejected
    : error => { throw error }
  const promise2 = new MyPromise((resolve, reject) => {
    if (that.state === PENDING) {
      that.resolvedCallbacks.push((value) => {
        setTimeout(() => {
          try {
            const x = onFulfilled(value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      })

      that.rejectedCallbacks.push((err) => {
        setTimeout(() => {
          try {
            const x = onRejected(err)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      })
    }
    else if (that.state === FULFILLED) {
      setTimeout(() => {
        try {
          const x = onFulfilled(that.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }, 0)
    }
    else if (that.state === REJECTED) {
      setTimeout(() => {
        try {
          const x = onRejected(that.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }, 0)
    }
  })
  return promise2;
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('promise and x refer to the same object.'))
  }
  if ((x != null) && (typeof x === 'object' || typeof x === 'function')) {
    let called = false;
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject)
          },
          err => {
            if (called) return;
            called = true;
            reject(err)
          }
        )
      } else {
        if (called) return;
        called = true;
        resolve(x)
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error)
    }
  }
  else {
    resolve(x)
  }
}

MyPromise.resolve = function (value) {

  if (value instanceof MyPromise) {
    return value;
  }
  return new MyPromise((resolve, reject) => {

    if (value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function') {
      setTimeout(() => {
        value.then(resolve, reject)
      }, 0)
    } else {
      resolve(value)
    }
  })
}

MyPromise.all = function (promiseList = []) {
  const promises = Array.from(promiseList)
  return new Promise((resolve, reject) => {
    let index = 0;
    const result = []
    if (promises.length === 0) {
      resolve(result)
    }
    else {
      for (let i = 0; i < promises.length; i++) {
        MyPromise
          .resolve(promises[i])
          .then(
            value => {
              result[index++] = value;
              if (index >= promises.length) {
                resolve(result)
              }
            },
            err => {
              reject(err)
              return
            }
          )
      }
    }
  })
}


MyPromise.defer = MyPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = MyPromise;
