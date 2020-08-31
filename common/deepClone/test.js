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

function test(cb, ...args) {
  const result = cb(obj, ...args)
  console.log('Source:', obj)
  console.log('Clone:', result)
  console.log(`Source === Clone : ${result === obj}`)
  console.log(`Source#team === Clone#team : ${result.team === obj.team}`)
  console.log(`Source#team#players === Clone#team#players : ${result.team.players === obj.team.players}`)
  console.log(`Source#team#players[0] === Clone#team#players[0] : ${result.team.players[0] === obj.team.players[0]}`)

}

module.exports = test;