function assignProperty(obj, prop, val) {
  if (obj[prop]) {
    if (obj.hasOwnProperty(prop)) {
      obj[prop] = val;
    } else {
      let proto = Object.getPrototypeOf(obj);
      while (!proto.hasOwnProperty(prop)) {
        proto = Object.getPrototypeOf(proto);
      }
      proto[prop] = val;
    }
  }
}

let fooA = { bar: 1 };
let fooB = Object.create(fooA);
let fooC = Object.create(fooB);

assignProperty(fooC, "bar", 2);
console.log(fooA.bar); // 2
console.log(fooC.bar); // 2

assignProperty(fooC, "qux", 3);
console.log(fooA.qux); // undefined
console.log(fooC.qux); // undefined
console.log(fooA.hasOwnProperty("qux")); // false
console.log(fooC.hasOwnProperty("qux")); // false