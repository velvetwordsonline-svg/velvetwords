// Test script to verify backend functionality
const fs = require('fs');
const path = require('path');

// Test 1: Check if backend is running
async function testBackendConnection() {
  try {
    const response = await fetch('http://localhost:5001/api/stories');
    console.log('✅ Backend connection:', response.status === 200 ? 'SUCCESS' : 'FAILED');
    return response.status === 200;
  } catch (error) {
    console.log('❌ Backend connection: FAILED -', error.message);
    return false;
  }
}

// Test 2: Check admin login
async function testAdminLogin() {
  try {
    const response = await fetch('http://localhost:5001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Admin login: SUCCESS');
      return data.token;
    } else {
      console.log('❌ Admin login: FAILED');
      return null;
    }
  } catch (error) {
    console.log('❌ Admin login: FAILED -', error.message);
    return null;
  }
}

// Test 3: Check MongoDB connection
async function testDatabase() {
  try {
    const response = await fetch('http://localhost:5001/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${await testAdminLogin()}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Database connection: SUCCESS');
      console.log('   Stories count:', data.stories);
      console.log('   Users count:', data.users);
      return true;
    } else {
      console.log('❌ Database connection: FAILED');
      return false;
    }
  } catch (error) {
    console.log('❌ Database connection: FAILED -', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Testing Backend Functionality\n');
  
  const backendOk = await testBackendConnection();
  if (!backendOk) {
    console.log('\n❌ Backend is not running. Please start it first:');
    console.log('   cd backend && npm run dev');
    return;
  }
  
  const token = await testAdminLogin();
  if (!token) {
    console.log('\n❌ Admin authentication failed. Check backend setup.');
    return;
  }
  
  await testDatabase();
  
  console.log('\n✅ All tests completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Upload a DOCX file through admin panel');
  console.log('2. Check if chapters are created in database');
  console.log('3. Test reader functionality');
}

runTests();