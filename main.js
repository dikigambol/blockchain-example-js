// simple implementation of blockchain with js
const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(index, timestamp, data, prevhash = '') {
        this.index = index,
            this.timestamp = timestamp,
            this.data = data,
            this.prevhash = prevhash,
            this.hash = this.calculateHash()
    }

    calculateHash() {
        return SHA256(this.index + this.prevhash + this.timestamp + JSON.stringify(this.data)).toString()
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2023", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.prevhash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false
            }

            if (currentBlock.prevhash !== prevBlock.hash) {
                return false
            }
        }

        return true
    }
}

let block = new Blockchain();
block.addBlock(new Block(1, "01/05/2023", { amount: 4 }));
block.addBlock(new Block(2, "01/07/2023", { amount: 10 }));

// if valid condition 
console.log(JSON.stringify(block, null, 4));
console.log("is blockchain valid? " + block.isChainValid());

// if invalid condition 
// you may change the data, but you can't copy the hash 
block.chain[1].data = { amount: 99 };
// try to put the hash instead of block, but it still invalid because
// the relationship with previous block is broken 
block.chain[1].hash = block.chain[1].calculateHash();

console.log(JSON.stringify(block, null, 4));
console.log("is blockchain valid? " + block.isChainValid());