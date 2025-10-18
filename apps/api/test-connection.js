// Simple test script to check MongoDB connection with Mongoose
const { connectDB, getConnectionStatus, Customer } = require('./src/database');

async function testConnection() {
  try {
    console.log('🧪 Testing MongoDB connection...');

    // Try to connect
    await connectDB();

    console.log('✅ Connection successful!');
    console.log('📊 Status:', getConnectionStatus());

    // Try to create a test customer
    const testCustomer = new Customer({
      name: 'Test User',
      email: 'demo@example.com',
      phone: '+1234567890',
      address: {
        street: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
      },
    });

    console.log('💾 Saving test customer...');
    await testCustomer.save();
    console.log('✅ Test customer saved!');

    // Try to find the customer
    const foundCustomer = await Customer.findOne({ email: 'demo@example.com' });
    console.log('🔍 Found customer:', foundCustomer ? 'Yes' : 'No');

    console.log('🎉 All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
