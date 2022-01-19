let readline = require("readline-sync");

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "O";

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }

  getMarker() {
    return this.marker;
  }
}

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; ++counter) {
      this.squares[String(counter)] = new Square();
    }
  }

  display() {
    console.log("");
    console.log("     |     |");
    console.log(`  ${this.squares["1"]}  |  ${this.squares["2"]}  |  ${this.squares["3"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["4"]}  |  ${this.squares["5"]}  |  ${this.squares["6"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["7"]}  |  ${this.squares["8"]}  |  ${this.squares["9"]}`);
    console.log("     |     |");
    console.log("");
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }

  displayWithClear() {
    console.clear();
    console.log("");
    console.log("");
    this.display();
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
    this.score = 0;
  }

  getMarker() {
    return this.marker;
  }

  getScore() {
    return this.score;
  }

  incrementScore() {
    this.score += 1;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTGame {
  static POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
  ];

  static WINS_PER_MATCH = 3;


  static joinOr(choices, separator = ", ", conjunction = "or") {
    if (choices.length === 1) {
      return String(choices[0]);
    } else if (choices.length === 2) {
      return `${choices[0]} ${conjunction} ${choices[1]}`;
    } else {
      let lastChoice = choices[choices.length - 1];
      let result = choices.slice(0, -1).join(separator);
      return `${result}${separator} ${conjunction} ${lastChoice}`;
    }
  }

  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
    this.firstPlayer = this.human;
  }

  play() {
    this.displayWelcomeMessage();
    this.board.display();

    while (true) {
      this.playGame();
      if (this.matchisWon()) {
        this.displayMatchWinner();
        break;
      }
      if (!this.playAgain()) break;
      this.board = new Board();
      this.firstPlayer = this.switchPlayer(this.firstPlayer);
      this.board.displayWithClear();
    }

    this.displayGoodbyeMessage();
  }

  playGame() {
    let currentPlayer = this.firstPlayer;
    while (true) {
      this.playerMoves(currentPlayer);
      if (this.gameOver()) break;

      this.board.displayWithClear();
      currentPlayer = this.switchPlayer(currentPlayer);
    }

    this.board.displayWithClear();
    this.displayResults();
    this.adjustScores();
    this.displayScores();
  }

  playAgain() {
    let response;
    while (true) {
      response = readline.question("Would you like to play again? (y/n)").toLowerCase();
      if (response === 'y') {
        return true;
      } else if (response === 'n') {
        return false;
      }
      console.log("Invalid response.");
    }
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to Tic Tac Toe!");
    console.log("");
  }

  displayGoodbyeMessage() {
    console.log("Thanks for playing Tic Tac Toe! Goodbye!");
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
    } else if (this.isWinner(this.computer)) {
      console.log("I won! I won! Take that, human!");
    } else {
      console.log("A tie game. How boring.");
    }
  }

  displayScores() {
    console.log("");
    console.log(`Score: Human - ${this.human.getScore()}, Computer - ${this.computer.getScore()}`);
  }

  displayMatchWinner() {
    if (this.human.getScore() === this.WINS_PER_MATCH) {
      console.log("You won the match!  Woo hoo!");
    } else if (this.computer.getScore() === this.WINS_PER_MATCH) {
      console.log("I won the match!  Muah ha ha!");
    }
  }

  switchPlayer(player) {
    return player === this.human ? this.computer : this.human;
  }


  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${TTTGame.joinOr(validChoices)}): `;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let choice;

    if (this.winExistsFor(this.computer)) {
      choice = this.findSquareToWin(this.computer);
    } else if (this.winExistsFor(this.human)) {
      choice = this.findSquareToWin(this.human);
    } else if (this.board.squares["5"].isUnused()) {
      choice = "5";
    } else {
      choice = this.pickRandomSquare();
    }

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  playerMoves(player) {
    if (player === this.human) {
      this.humanMoves();
    } else {
      this.computerMoves();
    }
  }

  pickRandomSquare() {
    let validChoices = this.board.unusedSquares();
    let choice;

    do {
      choice = Math.floor((9 * Math.random()) + 1).toString();
    } while (!validChoices.includes(choice));

    return choice;
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  winExistsFor(player) {
    return !!this.findSquareToWin(player);
  }

  findSquareToWin(player) {
    let opponent;
    if (player === this.human) {
      opponent = this.computer;
    } else {
      opponent = this.human;
    }

    let rowsWithWin = TTTGame.POSSIBLE_WINNING_ROWS.filter(row => {
      return this.board.countMarkersFor(player, row) === 2 &&
             this.board.countMarkersFor(opponent, row) === 0;
    });
    if (rowsWithWin.length) {
      let row = rowsWithWin[0];
      let win = row.find(key => this.board.squares[key].isUnused());
      return win;
    } else return null;
  }

  adjustScores() {
    if (this.isWinner(this.human)) {
      this.human.incrementScore();
    } else if (this.isWinner(this.computer)) {
      this.computer.incrementScore();
    }
  }

  matchisWon() {
    if (this.human.getScore() === this.WINS_PER_MATCH ||
        this.computer.getScore() === this.WINS_PER_MATCH) {
      return true;
    }
    return false;
  }
}

let game = new TTTGame();
game.play();