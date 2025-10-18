// Test script for analytics endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAnalytics() {
  console.log('📊 Testing Analytics API...\n');

  try {
    // Test 1: Daily revenue with default dates (last 30 days)
    console.log('1. Testing daily revenue (default last 30 days)...');
    const defaultRevenue = await axios.get(
      `${BASE_URL}/api/analytics/daily-revenue`
    );
    console.log(`✅ Found ${defaultRevenue.data.length} days of data`);
    if (defaultRevenue.data.length > 0) {
      console.log('Sample day:', defaultRevenue.data[0]);
    }
    console.log('');

    // Test 2: Daily revenue with specific date range
    console.log('2. Testing daily revenue with specific dates...');
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    const fromDate = weekAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];

    const specificRevenue = await axios.get(
      `${BASE_URL}/api/analytics/daily-revenue?from=${fromDate}&to=${toDate}`
    );
    console.log(`✅ Found ${specificRevenue.data.length} days in last week`);

    // Calculate total revenue
    const totalRevenue = specificRevenue.data.reduce(
      (sum, day) => sum + day.revenue,
      0
    );
    const totalOrders = specificRevenue.data.reduce(
      (sum, day) => sum + day.orderCount,
      0
    );

    console.log(`💰 Total revenue: $${totalRevenue.toFixed(2)}`);
    console.log(`📦 Total orders: ${totalOrders}`);
    console.log('');

    // Test 3: Show detailed analytics
    console.log('3. Daily breakdown:');
    specificRevenue.data.forEach((day) => {
      const date = new Date(day.date).toLocaleDateString();
      console.log(`   ${date}: $${day.revenue} (${day.orderCount} orders)`);
    });

    console.log('\n🎉 Analytics API working perfectly!');
  } catch (error) {
    console.error('❌ Analytics test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAnalytics();
