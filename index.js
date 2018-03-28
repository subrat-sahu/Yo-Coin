import SHA256 from 'crypto-js/sha256';

class Block {
  constructor(index, timeStamp, data, previousHash = '') {
    this.index = index;
    this.timeStamp = timeStamp;
    this.data = data;
    this.hash = this.calculateHash();
    this.previousHash = previousHash;
    this.nonce = 0;
  }

  // calculate the hash of the block
  calculateHash() {
    return SHA256(this.index
        + this.previousHash
        + this.timeStamp
        + this.nonce
        + JSON.stringify(this.data)).toString();
  }

  mineBlock(difficulty) {
    console.time(`mining ${this.index}`);
    while (this.hash.substring(0, difficulty) !== new Array(difficulty + 1).join('0')) {
      this.nonce += 1;
      this.hash = this.calculateHash();
    }
    console.timeEnd(`mining ${this.index}`);
    console.log(`Block Mines: ${this.hash}`);
  }
}

class BlockChain {
  constructor() {
    this.chain = [BlockChain.createGenesisBlock()];
    this.difficulty = 5;
  }

  static createGenesisBlock() {
    return new Block(0, 1522252337828, 'This is the first block', 0);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Adds new block to the block chain
  addBlock(block) {
    const newBlock = block;
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  // Checks for the validy of each block on the block chain
  isChainValid() {
    for (let i = 1; i < this.chain.length; i += 1) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== prevBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

const yoCoin = new BlockChain();

console.log('Mining Block 1 ...');
let block = new Block(1, 1522252339999, { amount: 4 });
yoCoin.addBlock(block);

console.log('Mining Block 2 ...');
block = new Block(2, 1522252339999, { amount: 10 });
yoCoin.addBlock(block);

