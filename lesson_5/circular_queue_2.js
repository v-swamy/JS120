class CircularQueue {
  constructor(size) {
    this.size = size;
    this.queue = (new Array(size)).fill(null);
    this.current = 0;
    this.oldest = null;
  }

  advanceCurrent() {
    if (this.current === this.size - 1) {
      this.current = 0;
    } else {
      this.current += 1;
    }
  }

  advanceOldest() {
    if (this.oldest === this.size - 1) {
      this.oldest = 0;
    } else {
      this.oldest += 1;
    }
  }

  enqueue(item) {
    if (this.oldest === null) {
      this.oldest = this.current;
    } else if (this.current === this.oldest) {
      this.advanceOldest()
    }
    this.queue[this.current] = item;
    this.advanceCurrent(this.current);
  }

  dequeue() {
    if (this.queue.every(item => item === null)) {
      return null;
    }

    let oldestItem = this.queue[this.oldest];
    this.queue[this.oldest] = null;
    this.advanceOldest();
    return oldestItem;
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

anotherQueue.enqueue(1)
anotherQueue.enqueue(2)
console.log(anotherQueue.dequeue() === 1);

anotherQueue.enqueue(3)
anotherQueue.enqueue(4)
console.log(anotherQueue.dequeue() === 2);

anotherQueue.enqueue(5)
anotherQueue.enqueue(6)
anotherQueue.enqueue(7)
console.log(anotherQueue.dequeue() === 4);
console.log(anotherQueue.dequeue() === 5);
console.log(anotherQueue.dequeue() === 6);
console.log(anotherQueue.dequeue() === 7);
console.log(anotherQueue.dequeue() === null);