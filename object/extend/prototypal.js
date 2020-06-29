function extend(proto) {
  function Ctor() { };
  Ctor.prototype = proto;
  return new Ctor();
}

const Person = {
  name: 'wenjiang',
  skills: ['sleep', 'eat']
}

const james = extend(Person)
console.log(james.name, james.skills) // wenjiang , ['sleep','eat']
james.name = 'handsome-boy'
james.skills.push('cry')

const davis = extend(Person)
console.log(davis.name, davis.skills) // wenjiang , ['sleep','eat','cry']