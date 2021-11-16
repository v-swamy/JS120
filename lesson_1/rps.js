

const readline = require('readline-sync');

function createPlayer() {
  return {
    move: null,
  };
}

function createComputer() {
  let playerObject = createPlayer();
  let computerObject = {
    choose() {
      let cumulativeWeights = [];
      this.choiceWeights.forEach((weight, idx) => cumulativeWeights.push(weight
        + (cumulativeWeights[idx - 1] || 0)));

      let random = Math.random() *
        cumulativeWeights[cumulativeWeights.length - 1];

      for (let idx = 0; idx < cumulativeWeights.length; idx += 1) {
        if (cumulativeWeights[idx] > random) {
          this.move = this.choices[idx];
          break;
        }
      }
    },

    choices: ['rock', 'paper', 'scissors', 'spock', 'lizard'],

    choiceWeights: [20, 20, 20, 20, 20],

    adjustWeights(moveWinRate) {
      let index = this.choices.indexOf(this.move);
      if (moveWinRate < 20) {
        this.choiceWeights[index] += 5;
      }

      if (moveWinRate > 20) {
        this.choiceWeights[index] -= 5;
      }
    }

  };
  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;

      while (true) {
        console.log('Please choose rock, paper, scissors, spock, or lizard:');
        choice = readline.question();
        if (['rock', 'paper', 'scissors', 'spock', 'lizard'].includes(choice)) break;
        console.log('Sorry, invalid choice.');
      }
      this.move = choice;
    },
  };

  return Object.assign(playerObject, humanObject);
}


const RPSGame = {

  human: createHuman(),
  computer: createComputer(),
  pointsToWin: 5,
  winningCombos: [
    ['scissors', 'paper'],
    ['paper', 'rock'],
    ['rock', 'lizard'],
    ['lizard', 'spock'],
    ['spock', 'scissors'],
    ['scissors', 'lizard'],
    ['lizard', 'paper'],
    ['paper', 'spock'],
    ['spock', 'rock'],
    ['rock', 'scissors']
  ],

  score: {
    computer: 0,
    human: 0,
  },

  winner: null,

  moveHistory: [],

  printDivider() {
    console.log('-----------------------');
  },

  updateMoveHistory() {
    let moveObj = {
      id: this.moveHistory.length + 1,
      human: this.human.move,
      computer: this.computer.move,
      winner: this.winner
    };

    this.moveHistory.push(moveObj);

  },

  displayMoveHistory() {
    console.log('Moves so far:');

    this.moveHistory.forEach(moveObj => {
      let moveText = '';
      for (let prop in moveObj) {
        moveText += prop + ': ' + moveObj[prop].toString() + ', ';
      }
      console.log(moveText.slice(0, -2));
    });
    this.printDivider();
  },

  moveWinRate(move) {
    let wins = this.moveHistory.filter(moveObj => moveObj.computer === move &&
      moveObj.winner === 'computer');
    return (wins.length / this.moveHistory.length) * 100;
  },

  displayScore() {
    console.log(`The score is: \nHuman: ${this.score.human} \nComputer: ${this.score.computer}`);
    if (this.score.human === this.pointsToWin) {
      console.log(`You've scored ${this.pointsToWin} points to win the match!`);
    } else if (this.score.computer === this.pointsToWin) {
      console.log(`Computer has scored ${this.pointsToWin} points to win the match!`);
    } else if (this.score.human === 5 && this.score.computer === 5) {
      console.log(`You and the computer have both scored ${this.pointsToWin} to tie the match!`);
    }
    this.printDivider();
  },

  displayWelcomeMessage() {
    console.log('Welcome to Rock, Paper, Scissors, Spock, Lizard!');
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper, Scissors, Spock, Lizard. Goodbye!');
  },

  findWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if (this.winningCombos.some(combo => combo[0] === humanMove &&
        combo[1] === computerMove)) {
      this.winner = 'human';
    } else if (this.winningCombos.some(combo => combo[0] === computerMove &&
               combo[1] === humanMove)) {
      this.winner = 'computer';
    } else {
      this.winner = 'tie';
    }
  },

  displayWinner() {
    console.log(`\nYou chose: ${this.human.move}`);
    console.log(`The computer chose: ${this.computer.move}`);

    if (this.winner === 'human') {
      console.log('You win!');
    } else if (this.winner === 'computer') {
      console.log('Computer wins!');
    } else {
      console.log("It's a tie!");
    }

    this.printDivider();
  },

  updateScore() {
    if (this.winner === 'human') {
      this.score.human += 1;
    } else if (this.winner === 'computer') {
      this.score.computer += 1;
    }
  },

  resetScore() {
    if (this.score.human === 5 || this.score.computer === 5) {
      this.score.human = 0;
      this.score.computer = 0;
    }
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question();
    console.clear();
    return answer.toLowerCase()[0] === 'y';
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.human.choose();
      this.computer.choose();
      this.findWinner();
      this.updateMoveHistory();
      this.displayWinner();
      this.updateScore();
      this.displayScore();
      this.resetScore();
      this.displayMoveHistory();
      this.computer.adjustWeights(this.moveWinRate(this.computer.move));
      if (!this.playAgain()) break;
    }
    this.displayGoodbyeMessage();
  },
};

RPSGame.play();
