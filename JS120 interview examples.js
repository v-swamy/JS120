// Encapsulation - data and relevant operations are bundled

let stella = {
  name: 'Stella',
  breed: 'Golden Retriever',
  speak() {
    console.log('Woof!');
  },
  display() {
    console.log(`${this.name} is a ${this.breed}`);  // use of 'this' keyword
  }
};

stella.display();

let vik = {
  name: 'Vik',
  city: 'Cleveland',
  pet: stella  // using stella object as collaborator object for vik
};

// Simple prototypal inheritance

let obj1 = { a: 1 };
let obj2 = Object.create(obj1);
console.log(obj2.a);
console.log(obj1.hasOwnProperty('a'));  //returns true
console.log(obj2.hasOwnProperty('a'));  // returns false
console.log(Object.getPrototypeOf(obj2) === obj1);  //returns false
obj1.b = 2;
console.log(obj2.b);  // changes in prototype object are inherited

//Higher Order Function - returning a function;

let foo = function() {
  console.log('I am a function');
};

let twice = func => {
  return function() {
    func();
    func();
  };
};

let doubleFoo = twice(foo);
doubleFoo();

//Context loss

let obj = {
  name: 'Vik',
  context: function() {
    console.log(this);
  },
  inner() {

    let printName = () => console.log(this.name);
    // function printName() {
    //   console.log(this.name);
    // }  //can resolve context loss with .bind(this), or change to arrow

    printName();  //can resolve context loss with .call(this)
  },
  foo() {
    [1, 2, 3].forEach(function(num) {
      console.log(`${num} ${this.name}`);
    }.bind(this));
  }
};

obj.context();

let copy = obj.context;
copy();  // context loss - method copied from object

obj.inner();  //loss of scope in inner function

obj.foo();

// Explicit contexts

function printName() {
  console.log(this.name);
}

let eli = { name: 'eli' };

printName();  // undefined
printName.call(eli);
let boundFunc = printName.bind(eli);
boundFunc();

// Factory Function

function createDog(name, breed) {
  return {
    name: name,
    breed: breed,
    speak() {
      console.log('Woof!');
    },
    display() {
      console.log(`${this.name} is a ${this.breed}`);  // use of 'this' keyword
    }
  };
}

let rex = createDog('Rex', 'German Shepherd');

// Constructor function w/subtype

function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `Hi! My name is ${this.name}.`;
}

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.paws = 4;

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function() {
  return Animal.prototype.speak.call(this) + ' Woof!'
};

Dog.prototype.display = function() {
  console.log(`${this.name} is a ${this.breed}`);  // use of 'this' keyword
};

let sydney = new Dog('Sydney', 'Golden Retriever');
console.log(sydney.speak());
sydney.display();

// Classes with mixin

const fetchable = {
  fetch() {
    console.log("WHERE'S THE BALL!!");
  }
}

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `Hi! My name is ${this.name}.`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  static paws = 4;

  display() {
    console.log(`${this.name} is a ${this.breed}`);
  }

  speak() {
    return 'Woof! Woof!';  //polymorphism
  }
}

Object.assign(Dog.prototype, fetchable);

class Cat extends Animal {}

let sydney = new Dog('Sydney', 'Golden Retriever');
let eli = new Cat('Eli');
console.log(sydney.speak());  //polymorphism
console.log(eli.speak());
sydney.display();
sydney.fetch();
eli.fetch();  // error


// OOLO

let animalPrototype = {
  speak() {
    return `Hi! My name is ${this.name}.`;
  },

  init(name) {
    this.name = name;
    return this;
  }
}

let dogPrototype = Object.create(animalPrototype);
dogPrototype.paws = 4;
dogPrototype.display = function() {
  console.log(`${this.name} is a ${this.breed}`);
}
dogPrototype.init = function(name, breed) {
  animalPrototype.init(name);
  this.breed = breed;
  return this;
}

let sydney = Object.create(dogPrototype).init('Sydney', 'Golden Retriever');
console.log(sydney.speak());
sydney.display();
console.log(sydney.paws);  // no static methods possible

// Duck typing (polymorphism)

class Painter {
  paint() {
    console.log('Painting...');
  }

  work() {
    this.paint();
  }
}

class Driver {
  drive() {
    console.log('Driving...')
  }

  work() {
    this.drive();
  }
}

let workers = [new Painter(), new Driver()];
workers.forEach(worker => worker.work());