const readline = require('readline-sync');
const shuffle = require('shuffle-array');

class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.hidden = false;
  }

  static SUITS = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  static RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
  static FACE_CARD_VALUES = {Jack: 10, Queen: 10, King: 10, Ace: 11};

  hide() {
    this.hidden = true;
  }

  reveal() {
    this.hidden = false;
  }

  value() {
    return Number(this.rank) ? Number(this.rank) :
      Card.FACE_CARD_VALUES[this.rank];
  }

  display() {
    if (this.hidden) {
      console.log('    ?????');
    } else {
      console.log(`    ${this.rank} of ${this.suit}`);
    }
  }
}

class Deck {
  constructor() {
    this.cards = this.build();
  }

  build() {
    let deck = [];
    Card.SUITS.forEach(suit => {
      Card.RANKS.forEach(rank => {
        deck.push(new Card(suit, rank));
      });
    });
    return deck;
  }

  shuffle() {
    shuffle(this.cards);
  }
}

class Player {
  constructor(deck) {
    this.deck = deck;
    this.hand = [];
    this.name = "Player";
    this.balance = Player.STARTING_BALANCE;
  }

  static STARTING_BALANCE = 5;
  static WINNING_BALANCE = 2 * Player.STARTING_BALANCE;
  static WINNING_SCORE = 21;

  hit() {
    this.hand.push(this.deck.cards.pop());
  }

  stay() {
  }

  score() {
    let numberOfAces = this.hand.filter(card => card.rank === "Ace").length;
    let score = this.hand.reduce((accum, card) => accum + card.value(), 0);
    while (score > Player.WINNING_SCORE && numberOfAces > 0) {
      score -= 10;
      numberOfAces -= 1;
    }
    return score;
  }

  clearHand() {
    this.hand = [];
  }

  displayScore() {
    console.log(`${this.name} has ${this.score()} points.`);
  }

  isBusted() {
    return this.score() > Player.WINNING_SCORE;
  }

  incrementBalance() {
    this.balance += 1;
  }

  decrementBalance() {
    this.balance -= 1;
  }

  isRich() {
    return this.balance >= Player.WINNING_BALANCE;
  }

  isBroke() {
    return this.balance <= 0;
  }

  displayBalance() {
    console.log(`You have $${this.balance} remaining.`);
  }
}


class Dealer extends Player {
  constructor(deck) {
    super(deck);
    this.name = "Dealer";
  }

  static HIT_MAX = 17;

  hideCard() {
    this.hand[1].hide();
  }

  revealCard() {
    this.hand[1].reveal();
  }

  deal(deck, player) {
    player.hand.push(deck.cards.pop());
    this.hand.push(deck.cards.pop());
    player.hand.push(deck.cards.pop());
    this.hand.push(deck.cards.pop());
    this.hideCard();
  }
}

class TwentyOneGame {
  constructor() {
    this.deck = new Deck();
    this.player = new Player(this.deck);
    this.dealer = new Dealer(this.deck);
    this.currentTurn = null;
    this.winner = null;
  }

  start() {
    this.displayWelcomeMessage();
    while (true) {
      this.dealCards();
      this.displayCards();
      this.playerTurn();
      this.dealerTurn();
      this.determineWinner();
      this.makePayout();
      this.displayResult();
      if (this.player.isBroke() || this.player.isRich()) {
        break;
      }
      if (!this.playAgain()) {
        break;
      }
      this.resetGame();
    }
    this.displayGoodbyeMessage();
  }

  dealCards() {
    if (this.deck.cards.length < 20) {
      let newDeck = new Deck();
      this.deck.cards = this.deck.cards.concat(newDeck.cards);
    }
    this.deck.shuffle();
    this.dealer.deal(this.deck, this.player);
  }

  displayCards() {
    if (this.currentTurn === "player" || this.currentTurn === "dealer") {
      console.clear();
      console.log("\n");
    }
    console.log("");
    console.log("Player's hand:");
    this.player.hand.forEach(card => card.display());
    console.log('');
    console.log("Dealer's hand:");
    this.dealer.hand.forEach(card => card.display());
    console.log("");
    console.log('-----------------------------------');
    this.player.displayScore();
    if (this.currentTurn === "dealer") {
      this.dealer.displayScore();
    }
  }

  playerTurn() {
    this.currentTurn = "player";
    while (true) {
      if (this.player.isBusted()) break;
      if (this.playerHits()) {
        this.player.hit();
        this.displayCards();
      } else {
        break;
      }
    }
  }

  playerHits() {
    console.log("\nHit or stay? (h/s)");
    let answer = readline.question()[0].toLowerCase();
    while (answer !== 'h' && answer !== 's') {
      console.log("Sorry, invalid response.  Please enter 'h' or 's'.");
      answer = readline.question()[0].toLowerCase();
    }
    return answer === 'h';
  }

  dealerTurn() {
    this.currentTurn = "dealer";
    if (!this.player.isBusted()) {
      this.dealer.revealCard();
      this.displayCards();
      while (this.dealer.score() < Dealer.HIT_MAX) {
        console.log('\nDealer Hits!');
        readline.keyInPause();
        this.dealer.hit();
        this.displayCards();
      }
    }
  }

  determineWinner() {
    if (this.player.isBusted()) {
      this.winner = "dealer";
    } else if (this.dealer.isBusted()) {
      this.winner = "player";
    } else if (this.dealer.score() > this.player.score()) {
      this.winner = "dealer";
    } else if (this.player.score() > this.dealer.score()) {
      this.winner = "player";
    } else {
      this.winner = "tie";
    }
  }

  makePayout() {
    if (this.winner === "player") {
      this.player.incrementBalance();
    } else if (this.winner === "dealer") {
      this.player.decrementBalance();
    }
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to 21!");
    console.log(`You get $${this.player.balance} to start. A win gets you $1, a loss costs you $1.`);
  }

  displayGoodbyeMessage() {
    if (this.player.isRich()) {
      console.log("You are rich! Enjoy your winnings!");
    } else if (this.player.isBroke()) {
      console.log("You are broke! Better luck next time!");
    }
    console.log("");
    console.log("Thanks for playing 21!");
  }

  displayResult() {
    console.log("");
    if (this.player.isBusted()) {
      console.log("You busted! You lose!");
    } else if (this.dealer.isBusted()) {
      console.log("Dealer busted! You win!");
    } else if (this.winner === "player") {
      console.log("You win!");
    } else if (this.winner === "dealer") {
      console.log("Dealer wins!");
    } else {
      console.log("It's a tie!");
    }
    this.player.displayBalance();
    console.log("");
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

  resetGame() {
    this.player.clearHand();
    this.dealer.clearHand();
    this.currentTurn = null;
    console.clear();
    console.log("\n");
  }
}

let game = new TwentyOneGame();
game.start();