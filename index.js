import SHA256 from 'crypto-js/sha256';

class Block {
  constructor(index, timeStamp, data, previousHash = '') {
    this.index = index;
    this.timeStamp = timeStamp;
    this.data = data;
    this.hash = this.calculateHash();
    this.previousHash = previousHash;
  }

  // calculate the hash of the block
  calculateHash() {
    return SHA256(this.index
        + this.previousHash
        + this.timeStamp
        + JSON.stringify(this.data)).toString();
  }
}

class BlockChain {
  constructor() {
    this.chain = [BlockChain.createGenesisBlock()];
  }

  static createGenesisBlock() {
    return new Block(0, 1522252337828, 'This is the first block', 0);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(block) {
    const newBlock = block;
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
}

const yoCoin = new BlockChain();
let block = new Block(1, 1522252339999, { amount: 4 });
yoCoin.addBlock(block);
block = new Block(2, 1522252339999, { amount: 10 });
yoCoin.addBlock(block);

console.log(JSON.stringify(yoCoin, null, 4));
