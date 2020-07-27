# 手写 Promise

## 实现

### Promise A+ 规范

// 

### 基本结构

`Promise`内需要有一个`state`来指示当前的状态，取值是`pending`,`fulfilled` 和 `rejected`中的其中一个，初始值为 `pending`

还需要一个`value`来存放Promise的最终值或者是失败的原因，`value`是任意的JavaScript中的合法值，包括`undefined`,`promise` 和 `thenable`

因为一个`promise`可以多次调用`then`，且在状态变成`fulfilled`或`rejected`后，需要按照顺序依次执行所有的回调函数，因此用两个数组来存放对应的回调函数列表。

`Promise`接收一个参数`fn`，其中`fn`这个参数是一个`executor`，接收一个 `resolve`函数，一个`rejected`函数作为参数，

即`Promise`函数签名为 `new Promise((resolve,rejected)=>{})`

`Promise`的大体结构如下（用`MyPromise`代替`Promise`)

```js
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
    // TODO
  }
  function reject(value) {
    // TODO
  }
  try {
    fn(resolve, reject)
  } catch (error) {
    reject(error)
  }
}
```

### resolve

`resolve`函数用于将一个`Promise`的状态从`pending`转变到`fulfilled`状态。

函数接收一个`value`参数，参数是`promise`的最终值，可能是普通的JavaScript值，或者是一个promise。

如果`value`是promise，应该在其完成后返回

```js
if (value instanceof MyPromise) {
  return value.then(v => resolve(v), e => reject(e))
}
```

然后对于其他情况，就只需要将`pending`状态转变成`fulfilled`状态即可

转变成`fulfilled`状态后，需要按照顺序依次的去执行每一个`resolveCallback`

```js
if (that.state === PENDING) {
  that.state = FULFILLED;
  that.value = value;
  that.resolvedCallbacks.forEach(cb => cb(value))
}
```

完整的`resolve`函数代码

```js
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
```

### reject

```js
function reject(value) {
  if (that.state === PENDING) {
    that.state = REJECTED;
    that.value = value;
    that.rejectedCallbacks.forEach(cb => cb(value))
  }
}
```

### then

`promise.then(onFulfilled,onRejected)`

一个promise的`then`方法接收两个参数，一个是`onFulfilled`函数，一个是`onRejected`函数。两个参数都是可选的参数。

在promise转变成`fulfilled`状态后，会调用`onFulfilled`函数，并且其第一个参数是promise的最终值`value`。

promise转变成`rejected`后，则会调用`onRejected`函数，其第一个参数是promise失败的reason

因为`Promise`的`then`方法可以链式进行调用，因此`then`方法的返回值也需要是一个`promise`，并且是新的`promise`，不能是`return this;`

也即`promise2 = promise1.then(onFulfilled,onRejected)`

`then`方法的大体结构如下：

```js
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
      // TOOD
    }
    else if (that.state === FULFILLED) {
      // TODO
    }
    else if (that.state === REJECTED) {
      // TODO
    }
  })
  return promise2;
}
```

#### resolvePromise

`then`方法接收的两个函数`onFulfilled`和`onRejected`分别会在`promise`的状态变成`fulfilled`和`rejected`时候执行，并且得到返回值`x`.

按照规范关于`then`方法的描述的*2.2.7.1*，对于`onFulfilled`和 `onRejected`的返回值`x`，执行一个 **Promise Resolution Procedure**操作，这个操作是一个抽象操作，对`promise2`和`x`进行输入

> The **promise resolution procedure** is an abstract operation taking as input a promise and a value, which we denote as `[[Resolve]](promise, x)`. If `x` is a thenable, it attempts to make `promise` adopt the state of `x`, under the assumption that `x` behaves at least somewhat like a promise. Otherwise, it fulfills `promise` with the value `x`.

按照规范里的描述，对`resolvePromise`方法进行实现：

```js
function resolvePromise(promise,x,resolve,reject){
  // TODO: promise resolution procedure
}
```

首先如果 `promise === x`，出现了循环引用，规范中说明的是需要`reject`一个`TypeError`

```js
if (promise === x) {
  reject(new TypeError('promise and x refer to the same object.'))
} 
```

例如下面的情况，就会出现一个循环引用

```js
const promise2 = promise1.then(value => {
  return promise2;
})
```

否则，如果`x`是一个`object`或`function`，则`let then = x.then`（这里可能会抛出抛出错误，需要用`catch`包住）

如果`then`是一个函数，则把`this`绑定到`x`上进行调用。然后第一个参数是函数，接收一个参数`y`，然后在函数内执行`resolvePromise(promise,y)`。第二个参数也是一个函数，接收一个发生错误的原因`err`，然后函数内`reject(err)`。

同时，规范还指出，一个promise只应该执行`fulfill`，`reject`一次，且两者之间只能执行一个，因此需要用一个变量来标志是否已经执行过。

```js
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
```

如果上面的情况都不满足，`x`是一个基本类型值，直接`resolve`这个值

得到完整的函数定义如下

```js
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
```

#### FULFILLED

按照规范的描述，在`then`方法中，如果promise是`fulfilled`状态，了执行`onFulfilled`函数，得到返回值`x`，然后执行**promise resolution procedure**过程

通过`setTimeout`来将同步代码转变成异步代码

```js
if (that.state === FULFILLED) {
  setTimeout(() => {
    try {
      const x = onFulfilled(that.value)
      resolvePromise(promise2, x, resolve, reject)
    } catch (error) {
      reject(error)
    }
  }, 0)
}
```

#### REJECTED

同样思路处理`rejected`状态

```js
if (that.state === REJECTED) {
  setTimeout(() => {
    try {
      const x = onRejected(that.value)
      resolvePromise(promise2, x, resolve, reject)
    } catch (error) {
      reject(error)
    }
  }, 0)
}
```

#### PENDING

如果promise处于`pending`状态，则需要等待其状态完成或失败，因此把回调函数添加到对应的回调函数列表中

```js
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
```

#### 完整`then`方法

```js
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

```

### 测试

`npm install -g promises-aplus-tests`安装测试脚本

增加以下代码

```js
Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}

module.exports = Promise;
```

执行 `promises-aplus-tests /path/to/promise.js`

测试脚本中共有872个测试用例，如果全部测试用例都通过的话，所写出的Promise是符合规范的。

### 完整代码

```js
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

MyPromise.defer = MyPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = MyPromise;
```

## 参考

- [github-[剖析Promise内部结构，一步一步教你实现一个完整的、能通过所有Test case的Promise]](https://github.com/xieranmaya/blog/issues/2)
- [掘金-可能是目前最易理解的手写promise](https://juejin.im/post/5dc383bdf265da4d2d1f6b23)
- [掘金-Promise的源码实现（完美符合Promise/A+规范）](https://juejin.im/post/5c88e427f265da2d8d6a1c84)
- [Promise A+规范](https://promisesaplus.com/)