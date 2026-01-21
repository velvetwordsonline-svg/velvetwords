require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Admin } = require('../src/models/models');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if admin already exists
    const existing = await Admin.findOne({ username: 'admin' });
    if (existing) {
      console.log('⚠️  Admin user already exists');
      process.exit(0);
    }
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@velvetwords.com'
    });
    
    console.log('✅ Admin created successfully!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('⚠️  Change password in production!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seed();
