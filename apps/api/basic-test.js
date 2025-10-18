// Very basic MongoDB connection test
const mongoose = require('mongoose');

require('dotenv').config();
const uri = process.env.MONGODB_URI;

async function basicTest() {
  console.log('🔬 Basic connection test...');
  console.log('URI:', uri ? uri.replace(/:[^:@]*@/, ':***@') : 'undefined'); // Hide password

  try {
    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || 'week5_ecommerce',
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Basic connection successful!');
    console.log('Connected to:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);

    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Basic connection failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  }
}

basicTest();
