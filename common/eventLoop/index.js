console.log(1)

setTimeout(() => console.log(2), 1000) // callback1

new Promise(resolve => {
  console.log(3)
  resolve(4)
})
  .then(res => { // callback2
    console.log(res)
    setTimeout(() => console.log(5), 2000) // callback3
    Promise
      .resolve()
      .then(res => { // callback4
        console.log(6)
      })
    return 7;
  })
  .then(res => console.log(res)) //callback5

setTimeout(() => { //callback6
  console.log(8)
  new Promise(resolve => {
    console.log(9)
    resolve(10)
  })
    .then(res => console.log(res)) // callback7
}, 3000)

console.log(11)