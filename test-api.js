// Quick test of the Aztro API functionality
import { getOfficial, normalizeOfficial } from './src/services/aztroApi.ts';

async function testAPI() {
  console.log('Testing Aztro API...');
  
  try {
    const result = await getOfficial('aries', 'today');
    console.log('API Result:', result);
    
    const sentences = normalizeOfficial(result.text);
    console.log('Normalized sentences:', sentences);
    
  } catch (error) {
    console.error('API Test failed:', error);
  }
}

testAPI();
