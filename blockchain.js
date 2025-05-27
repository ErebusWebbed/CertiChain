const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return crypto.createHash('sha256')
      .update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce)
      .digest('hex');
  }

  // Add simple proof of work (optional, for educational purposes)
  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join('0');
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.difficulty = 2; // For proof of work
    this.dataFile = path.join(__dirname, 'blockchain-data.json');
    
    // Try to load existing blockchain data
    this.loadChain();
    
    // If no data was loaded, create genesis block
    if (this.chain.length === 0) {
      this.chain = [this.createGenesisBlock()];
      this.saveChain();
    }
  }

  createGenesisBlock() {
    return new Block(0, Date.now().toString(), { message: "Genesis Block", hash: null }, "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(blockData) {
    const newBlock = new Block(
      this.chain.length,
      Date.now().toString(),
      blockData.data,
      this.getLatestBlock().hash
    );
    
    // Optional: enable proof of work
    // newBlock.mineBlock(this.difficulty);
    
    this.chain.push(newBlock);
    this.saveChain();
    return newBlock;
  }

  verifyFileHash(hash) {
    return this.chain.find(block => 
      block.data && 
      (typeof block.data === 'object') && 
      block.data.hash === hash
    );
  }
  
  getFullHistory(hash) {
    const results = [];
    for (const block of this.chain) {
      if (block.data && block.data.hash === hash) {
        results.push({
          index: block.index,
          timestamp: block.timestamp,
          fileName: block.data.fileName,
          uploadedAt: block.data.uploadedAt
        });
      }
    }
    return results;
  }

  // Reset blockchain to initial state with only genesis block
  resetBlockchain() {
    try {
      console.log(`Resetting blockchain from ${this.chain.length} blocks to 1 (genesis only)`);
      
      // Create a new genesis block
      this.chain = [this.createGenesisBlock()];
      
      // Save the reset blockchain
      this.saveChain();
      
      // Optionally clear the uploads directory
      this.clearUploadsDirectory();
      
      console.log('Blockchain reset successfully');
      return {
        success: true,
        message: 'Blockchain reset to genesis block',
        blockCount: this.chain.length
      };
    } catch (error) {
      console.error('Error resetting blockchain:', error);
      return {
        success: false,
        message: 'Failed to reset blockchain',
        error: error.message
      };
    }
  }

  // Helper method to clear uploads directory
  clearUploadsDirectory() {
    try {
      const uploadDir = path.join(__dirname, 'uploads');
      if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);
        for (const file of files) {
          fs.unlinkSync(path.join(uploadDir, file));
        }
        console.log(`Cleared ${files.length} files from uploads directory`);
      }
    } catch (error) {
      console.error('Error clearing uploads directory:', error);
      // Don't throw error, as this is not critical for blockchain reset
    }
  }

  // Get blockchain statistics
  getStats() {
    const fileBlocks = this.chain.filter(block => 
      block.data && block.data.hash && block.index > 0
    );
    
    return {
      totalBlocks: this.chain.length,
      fileBlocks: fileBlocks.length,
      genesisBlock: this.chain[0],
      latestBlock: this.getLatestBlock(),
      isValid: this.isChainValid()
    };
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Validate hash calculation
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Validate chain linkage
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
  
  // Save blockchain to file
  saveChain() {
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(this.chain, null, 2));
    } catch (err) {
      console.error('Error saving blockchain:', err);
    }
  }
  
  // Load blockchain from file
  loadChain() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = fs.readFileSync(this.dataFile, 'utf8');
        const parsedChain = JSON.parse(data);
        
        // Reconstruct Block objects with their methods
        this.chain = parsedChain.map(blockData => {
          const block = new Block(
            blockData.index,
            blockData.timestamp,
            blockData.data,
            blockData.previousHash
          );
          block.hash = blockData.hash;
          block.nonce = blockData.nonce || 0;
          return block;
        });
        
        console.log(`Loaded ${this.chain.length} blocks from storage`);
      }
    } catch (err) {
      console.error('Error loading blockchain:', err);
      // Start with empty chain in case of error
      this.chain = [];
    }
  }
}

module.exports = Blockchain;