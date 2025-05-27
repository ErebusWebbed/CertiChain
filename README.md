# CertiChain

# 🚀 Quick Start

Prerequisites

Node.js (v14.0.0 or higher)
npm or yarn package manager

Installation

# Clone the repository
git clone https://github.com/ErebusWebbed/certichain.git
cd certichain

# Install dependencies
npm install

#Start the server
npm start

# Open your browser
http://localhost:3000


# Dependencies
json{
  "express": "^4.18.2",
  "express-fileupload": "^1.4.0",
  "crypto": "built-in",
  "fs": "built-in",
  "path": "built-in"
}
# 📖 Usage
1. Upload Files

Drag and drop files or click to browse
Files are hashed using SHA-256
Hash is stored in a new blockchain block
Receive confirmation with block details

2. Verify Files

Upload the same file for verification
System compares the file hash with blockchain records
Get verification status and upload history
View all instances of the file in the blockchain

3. Explore Blockchain

View all blocks in the blockchain
See file details, timestamps, and hashes
Monitor blockchain statistics
Track chain validity in real-time

4. Administrative Functions

Reset blockchain to genesis block
Clear all uploaded files
View comprehensive blockchain statistics

# 🔧 API Endpoints
GET /api/chain
Returns the complete blockchain with statistics.
Response:
json{
  "chain": [...],
  "blockCount": 5,
  "isValid": true,
  "stats": {
    "totalBlocks": 5,
    "fileBlocks": 4,
    "genesisBlock": {...},
    "latestBlock": {...},
    "isValid": true
  }
}
POST /api/upload
Upload a file and store its hash on the blockchain.
Request: multipart/form-data with file
Response:
json{
  "success": true,
  "fileName": "document.pdf",
  "fileHash": "a1b2c3d4...",
  "blockIndex": 3,
  "timestamp": "1640995200000"
}
POST /api/verify
Verify a file's integrity against the blockchain.
Request: multipart/form-data with file
Response:
json{
  "verified": true,
  "fileName": "document.pdf",
  "fileHash": "a1b2c3d4...",
  "blockIndex": 3,
  "uploadHistory": [...]
}
POST /api/reset
Reset the blockchain to genesis block only.
Response:
json{
  "success": true,
  "message": "Blockchain reset to genesis block",
  "blockCount": 1,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
GET /api/stats
Get blockchain statistics.
Response:
json{
  "totalBlocks": 5,
  "fileBlocks": 4,
  "genesisBlock": {...},
  "latestBlock": {...},
  "isValid": true
}
