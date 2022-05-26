const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;

const ec = new EC('secp256k1'); // bitcoin wallets algorithm.

class Action {
    constructor(fromAddress, toAddress, amount, endDate, date) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.endDate = endDate;
        this.date = date;
    }

    calculateHash() {
        return SHA256(this.fromAddress, this.toAddress, this.amount, this.endDate, this.date).toString();
    }

    signAction(privateKey) {
        const publicKey = ec.keyFromPrivate(privateKey).getPublic('hex');

        if (publicKey!== this.fromAddress) {
            throw new Error("This is not your wallet you're trying to use.");
        }

        const hashTx = this.calculateHash();
        const sig = ec.keyFromPrivate(privateKey).sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if (!this.fromAddress) return true;

        if (!this.signature || !this.signature.length) {
            throw new Error("No signature in this action");
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {
    constructor(date, action, previousHash = '') {
        this.previousHash = previousHash;
        this.date = date;
        this.action = action;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.previousHash + this.date + JSON.stringify(this.action)).toString();
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
            console.log("here");

            throw new Error("Action must include from and to address");
        }

        if (!action.isValid()) {
            console.log("hi");

            throw new Error("Action is not valid");
        }

        const block = new Block(Date.now(), action, this.getLatestBlock().hash);
        console.log(this.chain);
        this.chain.push(block);
    }

    // getBalanceOfAddress(address) {
    //     let balance = 0;
    //     for (const block of this.chain) {
    //         for (const trans of block.actions) {
    //             if (trans.fromAddress === address) {
    //                 balance -= trans.amount;
    //             } else if (trans.toAddress === address) {
    //                 balance += trans.amount;
    //             }
    //         }
    //     }
    //     return balance;
    // }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash() ||
                currentBlock.previousHash !== previousBlock.hash ||
                !currentBlock.hashValidAction()) {
                return false;
            }
        }

        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Action = Action;