// class CircularQueue {
//   constructor(size) {
//     this.queue = new Array(size);
//     this.endIndex = size - 1;
//     this.oldestIndex = 0;
//     this.currentIndex = 0;
//   }

//   enqueue(item) {

//     if (this.indexIsFull(this.currentIndex)) {
//       this.incrementOldestIndex();
//     }

//     this.queue[this.currentIndex] = item;

//     this.incrementCurrentIndex();
//   }

//   dequeue() {
//     if (this.isEmpty()) {
//       return null;
//     }

//     let item = this.queue[this.oldestIndex];
//     this.queue[this.oldestIndex] = null;

//     this.incrementOldestIndex();

//     return item;
//   }

//   indexIsFull(index) {
//     return !!this.queue[index];
//   }

//   incrementOldestIndex() {
//     this.oldestIndex += 1;
//     if (this.oldestIndex > this.endIndex) {
//       this.oldestIndex = 0;
//     }
//   }

//   incrementCurrentIndex() {
//     this.currentIndex += 1;
//     if (this.currentIndex > this.endIndex) {
//       this.currentIndex = 0;
//     }
//   }

//   isEmpty() {
//     return this.queue.every(item => !item);
//   }
// }

class CircularQueue {
  constructor(size) {
    this.size = size;
    this.queue = [];
  }

  enqueue(item) {
    this.queue.push(item);
    if (this.queue.length > this.size) {
      this.queue.shift();
    }
  }

  dequeue() {
    return this.queue.shift() || null;
  }
}


let queue = new CircularQueue(3);
console.log(queue.dequeue() === null);

queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue() === 1);

queue.enqueue(3);
queue.enqueue(4);
console.log(queue.dequeue() === 2);

queue.enqueue(5);
queue.enqueue(6);
queue.enqueue(7);
console.log(queue.dequeue() === 5);
console.log(queue.dequeue() === 6);
console.log(queue.dequeue() === 7);
console.log(queue.dequeue() === null);

let anotherQueue = new CircularQueue(4);
console.log(anotherQueue.dequeue() === null);

anotherQueue.enqueue(1);
anotherQueue.enqueue(2);
console.log(anotherQueue.dequeue() === 1);

anotherQueue.enqueue(3);
anotherQueue.enqueue(4);
console.log(anotherQueue.dequeue() === 2);

anotherQueue.enqueue(5);
anotherQueue.enqueue(6);
anotherQueue.enqueue(7);
console.log(anotherQueue.dequeue() === 4);
console.log(anotherQueue.dequeue() === 5);
console.log(anotherQueue.dequeue() === 6);
console.log(anotherQueue.dequeue() === 7);
console.log(anotherQueue.dequeue() === null);