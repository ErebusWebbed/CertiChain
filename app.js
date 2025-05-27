const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Blockchain = require('./blockchain');
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize blockchain
const myChain = new Blockchain();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  abortOnLimit: true
}));

// Routes
app.get('/api/chain', (req, res) => {
  res.json({
    chain: myChain.chain,
    blockCount: myChain.chain.length,
    isValid: myChain.isChainValid(),
    stats: myChain.getStats()
  });
});

app.post('/api/upload', (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    
    const file = req.files.file;
    const hash = crypto.createHash('sha256').update(file.data).digest('hex');
    
    // Store uploaded file (optional)
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    
    // Save file with hash as name to avoid duplicates
    const filePath = path.join(uploadDir, `${hash}-${file.name}`);
    file.mv(filePath, (err) => {
      if (err) {
        console.error('Error saving file:', err);
        // Continue processing even if file save fails
      }
    });
    
    const blockData = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.mimetype,
      hash: hash,
      uploadedAt: new Date().toISOString()
    };
    
    const newBlock = myChain.addBlock({
      data: blockData
    });
    
    res.json({
      success: true,
      fileName: file.name,
      fileHash: hash,
      blockIndex: newBlock.index,
      timestamp: newBlock.timestamp
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during file upload' });
  }
});

app.post('/api/verify', (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    
    const file = req.files.file;
    const hash = crypto.createHash('sha256').update(file.data).digest('hex');
    const found = myChain.verifyFileHash(hash);
    
    if (found) {
      // Get all instances of this file in the blockchain
      const history = myChain.getFullHistory(hash);
      
      res.json({
        verified: true,
        fileName: file.name,
        fileHash: hash,
        blockIndex: found.index,
        uploadHistory: history
      });
    } else {
      res.json({
        verified: false,
        fileName: file.name,
        fileHash: hash,
        message: 'File not found in blockchain or has been tampered with.'
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Server error during file verification' });
  }
});

// Reset blockchain endpoint
app.post('/api/reset', (req, res) => {
  try {
    const result = myChain.resetBlockchain();
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        blockCount: result.blockCount,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.message
      });
    }
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during blockchain reset' 
    });
  }
});

// Get blockchain statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = myChain.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Error retrieving blockchain statistics' });
  }
});

// Catch-all for SPA (if you add a frontend framework later)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`FileChain server running on http://localhost:${PORT}`);
});