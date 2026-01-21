const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models/models');

const router = express.Router();

// Test endpoint to check admin
router.get('/test-admin', async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: 'admin' });
    res.json({ 
      exists: !!admin, 
      username: admin?.username,
      hasPassword: !!admin?.password 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register admin (run once to create admin account)
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      username,
      password: hashedPassword,
      email
    });
    await admin.save();

    res.json({ success: true, message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username });
    console.log('Admin found:', !!admin);
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    console.log('Password valid:', isValid);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Login successful for:', username);
    res.json({ 
      success: true, 
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
