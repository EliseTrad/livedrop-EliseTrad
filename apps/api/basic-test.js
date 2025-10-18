// Very basic MongoDB connection test
const mongoose = require('mongoose');

const uri =
  'mongodb+srv://elise_user:gLJqtzQwUMlKf7Df@euriskocluster0.rekgzby.mongodb.net/?retryWrites=true&w=majority&appName=EuriskoCluster0';

async function basicTest() {
  console.log('🔬 Basic connection test...');
  console.log('URI:', uri.replace(/:[^:@]*@/, ':***@')); // Hide password

  try {
    await mongoose.connect(uri, {
      dbName: 'week5_ecommerce',
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
