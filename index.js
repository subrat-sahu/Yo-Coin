import SHA256 from 'crypto-js/sha256';

class Transaction {
  constructor(fromAddr, toAddr, amount) {
    this.fromAddr = fromAddr;
    this.toAddr = toAddr;
    this.amount = amount;
  }
}

class Block {
  constructor(timeStamp, transactions, previousHash = '') {
    this.timeStamp = timeStamp;
    this.transactions = transactions;
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
        + JSON.stringify(this.transactions)).toString();
  }

  /**
   * 
   * 
   * @param {int} difficulty 
   * @memberof Block
   */
  mineBlock(difficulty) {
    console.time('mining');
    while (this.hash.substring(0, difficulty) !== new Array(difficulty + 1).join('0')) {
      this.nonce += 1;
      this.hash = this.calculateHash();
    }
    console.timeEnd('mining');
    console.log(`Block Mines: ${this.hash}`);
  }
}

class BlockChain {
  constructor() {
    this.chain = [BlockChain.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  static createGenesisBlock() {
    return new Block(1522252337828, 'This is the first block', 0);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Adds new block to the block chain
  // addBlock(block) {
  //   const newBlock = block;
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   newBlock.mineBlock(this.difficulty);
  //   newBlock.hash = newBlock.calculateHash();
  //   this.chain.push(newBlock);
  // }

  /**
   * 
   * 
   * @param {object} miningRewardAddr 
   * @memberof BlockChain
   */
  minePendingTransations(miningRewardAddr) {
    const block = new Block((new Date).getTime(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('Block Successfully Mined ... ');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddr, this.miningReward),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);    
  }

  getBalanceofAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for(const transaction of block.transactions) {
        if (transaction.fromAddr === address){
          balance -= transaction.amount;
        }

        if(transaction.toAddr === address) {
          balance += transaction.amount
        }
      }
    }
    return balance;
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

yoCoin.createTransaction(new Transaction('address 1', 'address 2', 100));
yoCoin.createTransaction(new Transaction('address 2', 'address 1', 70));
yoCoin.createTransaction(new Transaction('address 1', 'address 3', 30));

console.log('\n start the mining...');

yoCoin.minePendingTransations('subrats-address');
console.log(`Your balance for mining yo coin: ${yoCoin.getBalanceofAddress('subrats-address')}`);
console.log(`Your balance for mining yo coin: ${yoCoin.getBalanceofAddress('address 1')}`);
console.log(`Your balance for mining yo coin: ${yoCoin.getBalanceofAddress('address 2')}`);

console.log('\n start the mining again... ');

yoCoin.minePendingTransations('subrats-address');
console.log(`Your balance for mining yo coin: ${yoCoin.getBalanceofAddress('subrats-address')}`);
console.log(`Your balance for mining yo coin: ${yoCoin.getBalanceofAddress('address 1')}`);
console.log(`Your balance for mining yo coin: ${yoCoin.getBalanceofAddress('address 2')}`);

console.log(JSON.stringify(yoCoin.chain, null, 4));
