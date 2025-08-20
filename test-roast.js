// Test the roast generator
import { generateRoast } from './src/services/roastGenerator.ts';
import { generateDeterministicSeed } from './src/utils/prng.ts';

console.log('Testing English Roast Generator...\n');

const signs = ['aries', 'leo', 'scorpio'];
const cringeLevels = [0, 1, 2, 3];

signs.forEach(sign => {
  console.log(`\n=== ${sign.toUpperCase()} ===`);
  
  cringeLevels.forEach(cringe => {
    const seed = generateDeterministicSeed(sign, '2025-08-20', cringe);
    const roast = generateRoast({
      sign: sign,
      day: 'today',
      cringe: cringe,
      seed
    });
    
    console.log(`Cringe ${cringe}: ${roast.text}`);
  });
});
