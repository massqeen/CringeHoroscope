// Test the horoscope composition
import { composeResult } from './src/services/horoscopeComposer.ts';
import { generateRoast } from './src/services/roastGenerator.ts';
import { generateDeterministicSeed } from './src/utils/prng.ts';

console.log('Testing Horoscope Composition...\n');

// Mock official horoscope
const mockOfficial = {
  text: "Your fiery energy will guide you through today's challenges. Take bold action but remember to think before you leap. Trust your instincts and embrace new opportunities.",
  luckyColor: "red",
  luckyNumber: 7
};

const sign = 'aries';
const today = '2025-08-20';
const cringeLevels = [0, 1, 2, 3];
const modes = ['official', 'roast', 'mix'];

modes.forEach(mode => {
  console.log(`\n=== MODE: ${mode.toUpperCase()} ===`);
  
  cringeLevels.forEach(cringe => {
    const seed = generateDeterministicSeed(sign, today, cringe);
    
    // Generate roast
    const roast = generateRoast({
      sign: sign,
      day: 'today',
      cringe: cringe,
      seed
    });
    
    // Compose result
    const result = composeResult({
      mode: mode,
      official: mockOfficial,
      roast,
      cringe: cringe,
      seed
    });
    
    console.log(`Cringe ${cringe} (${result.source}):`);
    console.log(`"${result.text}"`);
    if (result.luckyColor) console.log(`Lucky: ${result.luckyColor} / ${result.luckyNumber}`);
    console.log('');
  });
});
