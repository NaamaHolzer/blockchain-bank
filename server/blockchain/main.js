const { Blockchain, Transaction } = require('./blockchain')
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // bitcoin wallets algorithm.

const myKey = ec.keyFromPrivate('bad210767b0716e3bfcc9655680da5771203de89f9d181bb8da549ca4a55d66d');
const myWalletAddress = myKey.getPublic('hex');

const otherKey = ec.keyFromPrivate('117db8377e494555b76eac5eb243f54200ed98052839fa98a68c0fd427a2f604');
const otherWalletAddress = otherKey.getPublic('hex');


const levCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, otherWalletAddress, 10); // from public to public
tx1.signTransaction(myKey); // must be the private of the wallet sending it
levCoin.addTransaction(tx1);

const tx2 = new Transaction(otherWalletAddress, myWalletAddress, 500); // from public to public
tx2.signTransaction(otherKey); // must be the private of the wallet sending it
levCoin.addTransaction(tx2);

console.log("\n Starting the miner...");
levCoin.minePendingTransactions(myWalletAddress);
console.log("my balance", levCoin.getBalanceOfAddress(myWalletAddress));

levCoin.chain[1].transactions[0].amount = 1;

console.log("Is valid?", levCoin.isChainValid());