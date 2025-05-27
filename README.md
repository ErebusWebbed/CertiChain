# CertiChain

# 🔐 Core Functionality

File Hash Storage: Upload files and store their SHA-256 hashes on the blockchain
Integrity Verification: Verify if files have been tampered with by comparing hashes
Blockchain Explorer: Visual interface to explore all blocks and transactions
Persistent Storage: Blockchain data persists between server restarts

# 🎨 Enhanced UI/UX

Modern Design: Beautiful, responsive interface with gradient backgrounds and smooth animations
Drag & Drop: Intuitive file upload with drag-and-drop functionality
Real-time Stats: Live blockchain statistics and status monitoring
Interactive Elements: Hover effects, loading animations, and visual feedback
Mobile Responsive: Optimized for all device sizes
Dark Mode Support: Automatic dark mode detection and styling

# 🛠️ Technical Features

RESTful API: Complete API endpoints for blockchain operations
File Upload Handling: Support for files up to 50MB
Blockchain Reset: Administrative function to reset the blockchain
Error Handling: Comprehensive error handling and user feedback
Performance Optimized: Efficient file processing and blockchain operations

# 🚀 Quick Start
Prerequisites

Node.js (v14.0.0 or higher)
npm or yarn package manager

Installation

Clone the repository
git clone https://github.com/yourusername/certichain.git
cd certichain

Install dependencies
npm install

Start the server
npm start

Open your browser
http://localhost:3000


Dependencies
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
