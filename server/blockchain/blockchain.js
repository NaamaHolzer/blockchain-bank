const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;

const ec = new EC("secp256k1"); // bitcoin wallets algorithm.

class Action {
  constructor(
    fromUser,
    toUser,
    fromAddress,
    toAddress,
    amount,
    endDate,
    date,
    id,
    isClosed = false,
    signature = ""
  ) {
    (this.fromUser = fromUser),
      (this.toUser = toUser),
      (this.fromAddress = fromAddress);
    this.toAddress = toAddress;
    this.amount = amount;
    this.endDate = endDate;
    this.date = date;
    this.id = id;
    this.isClosed = isClosed;
    if (signature !== "") this.signature = signature;
  }

  calculateHash() {
    return SHA256(
      this.fromUser,
      this.toUser,
      this.fromAddress,
      this.toAddress,
      this.amount,
      this.endDate,
      this.date
    ).toString();
  }

  signAction(privateKey) {
    const publicKey = ec.keyFromPrivate(privateKey).getPublic("hex");

    if (publicKey !== this.fromAddress) {
      throw new Error("This is not your wallet you're trying to use.");
    }

    const hashTx = this.calculateHash();
    const sig = ec.keyFromPrivate(privateKey).sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid() {
    if (!this.fromAddress) return true;

    if (!this.signature || !this.signature.length) {
      console.log(this)
      throw new Error("No signature in this action");
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Block {
  constructor(date, action, previousHash = "", hash = "") {
    this.previousHash = previousHash;
    this.date = date;
    this.action = action;
    if (hash === "") {
      const calc = this.calculateHash();
      this.hash = calc;
    } else this.hash = hash;
  }

  calculateHash() {
    return SHA256(
      this.action.previousHash + this.date + this.fromUser+
      this.action.toUser+
      this.action.fromAddress+
      this.action.toAddress+
      this.action.amount+
      this.action.endDate+
      this.action.date
    ).toString();
  }

  hashValidAction() {
    if (!this.action.isValid()) {
      return false;
    }
    return true;
  }
}

class Blockchain {
  constructor(blockchain) {
    if (blockchain) {
      this.chain = blockchain.chain;
    } else {
      this.chain = [this.createGenesisBlock()];
    }
  }

  getChain() {
    return this.chain;
  }

  createGenesisBlock() {
    return new Block("05/05/2022", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addAction(action) {
    if (!action.fromAddress || !action.toAddress) {
      throw new Error("Action must include from and to address");
    }

    if (!action.isValid()) {
      throw new Error("Action is not valid");
    }

    const block = new Block(Date.now(), action, this.getLatestBlock().hash);
    this.chain.push(block);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = new Block(
        this.chain[i].date,
        new Action(
          this.chain[i].action.fromUser,
          this.chain[i].action.toUser,
          this.chain[i].action.fromAddress,
          this.chain[i].action.toAddress,
          this.chain[i].action.amount,
          this.chain[i].action.endDate,
          this.chain[i].action.date,
          this.chain[i].action.id,
          this.chain[i].action.isClosed,
          this.chain[i].action.signature,
        ),
        this.chain[i].previousHash,
        this.chain[i].hash
      );
      const previousBlock = new Block(
        this.chain[i - 1].date,
        new Action(
          this.chain[i - 1].action.fromUser,
          this.chain[i - 1].action.toUser,
          this.chain[i - 1].action.fromAddress,
          this.chain[i - 1].action.toAddress,
          this.chain[i - 1].action.amount,
          this.chain[i - 1].action.endDate,
          this.chain[i - 1].action.date,
          this.chain[i - 1].action.id,
          this.chain[i - 1].action.isClosed,
          this.chain[i - 1].action.signature,

        ),
        this.chain[i - 1].previousHash,
        this.chain[i - 1].hash
      );

      if (
        currentBlock.hash !== currentBlock.calculateHash() ||
        currentBlock.previousHash !== previousBlock.hash ||
        !currentBlock.hashValidAction()
      ) {
        return false;
      }
    }

    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Action = Action;
