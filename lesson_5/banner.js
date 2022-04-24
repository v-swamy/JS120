class Banner {
  constructor(message, width = message.length + 4) {
    this.message = message;
    this.width = width;
    this.maxMessageLength = width - 4;
  }

  displayBanner() {
    console.log([this.horizontalRule(), this.emptyLine(), this.messageLine(), this.emptyLine(), this.horizontalRule()].join("\n"));
  }

  horizontalRule() {
    return `+-${"-".repeat(this.width - 4)}-+`;
  }

  emptyLine() {
    return `| ${" ".repeat(this.width - 4)} |`;
  }

  messageLine() {
    if (this.message.length > this.maxMessageLength) {
      let messageCopy = this.message;
      let slicedMessage = "";

      while (messageCopy.length > this.maxMessageLength) {
        slicedMessage += `| ${messageCopy.slice(0, this.maxMessageLength)} |\n`;
        messageCopy = messageCopy.slice(this.maxMessageLength);
      }

      if (messageCopy) {
        let padding = (this.width - messageCopy.length - 4) / 2;
        messageCopy = messageCopy.padStart(messageCopy.length + padding, " ");
        messageCopy = messageCopy.padEnd(messageCopy.length + padding, " ");
        slicedMessage += `| ${messageCopy} |`;
      }

      return slicedMessage;
    } else return `| ${this.message} |`;
  }
}

let banner1 = new Banner('To boldly go where no one has gone before.');
banner1.displayBanner();

let banner2 = new Banner('');
banner2.displayBanner();

let banner3 = new Banner('To boldly go where no one has gone before.', 20);
banner3.displayBanner();