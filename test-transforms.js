// Test advanced text transforms
import { generateRoast } from './src/services/roastGenerator.ts';
import { generateDeterministicSeed } from './src/utils/prng.ts';

console.log('🎨 Advanced Text Transforms Test\n');

const testSign = 'leo';
const testDate = '2025-08-20';

console.log('='.repeat(70));
console.log('TRANSFORM PROGRESSION DEMONSTRATION');
console.log('='.repeat(70));

// Generate multiple samples for each cringe level to show variety
for (let cringe = 0; cringe <= 3; cringe++) {
  console.log(`\n🎛️ CRINGE LEVEL ${cringe}:`);
  console.log('-'.repeat(50));
  
  // Generate 3 samples with different seeds to show transform variety
  for (let sample = 1; sample <= 3; sample++) {
    const seed = generateDeterministicSeed(testSign, testDate, cringe) + sample * 1000;
    const result = generateRoast({
      sign: testSign,
      day: 'today',
      cringe: cringe,
      seed
    });
    
    console.log(`Sample ${sample}: "${result.text}"`);
  }
  console.log('');
}

console.log('='.repeat(70));
console.log('TRANSFORM FEATURES BY LEVEL:');
console.log('='.repeat(70));

console.log('\n🟢 LEVEL 0 (Mild):');
console.log('• Clean, unmodified text');
console.log('• Professional tone');
console.log('• Standard emojis');

console.log('\n🟡 LEVEL 1 (Ironic):');
console.log('• 10% mild emphasis: "(you know what I mean)"');
console.log('• 15% emoji intensification: 😊 → 😊✨');
console.log('• Subtle sarcastic touches');

console.log('\n🟠 LEVEL 2 (Sarcastic):');
console.log('• 20% alternating caps: "amazing" → "aMaZiNg"');
console.log('• Hyperbole: "very" → "INCREDIBLY"');
console.log('• 25% interjections: "OMG", "LITERALLY"');
console.log('• 30% emoji upgrades: 😏 → 😏👑💅✨');

console.log('\n🔴 LEVEL 3 (Cringe Hard):');
console.log('• 40% vowel elongation: "good" → "goooood"');
console.log('• 35% alternating caps on 2-3 words');
console.log('• Maximum hyperbole: "nice" → "MIND-BLOWING"');
console.log('• 40% multiple interjections: "FR FR", "NO CAP"');
console.log('• 50% emoji explosion: 🤡 → 🤡🎪💥⚡🌪️');

console.log('\n✨ ALTERNATING CAPS EXAMPLES:');
console.log('• "amazing" → "aMaZiNg"');
console.log('• "energy" → "eNeRgY"');
console.log('• "absolutely" → "aBsOlUtElY"');

console.log('\n🎵 VOWEL ELONGATION EXAMPLES:');
console.log('• "good" → "goooood"');
console.log('• "amazing" → "amaaaaazing"');
console.log('• "energy" → "eneeeergy"');

console.log('\n💬 INTERJECTION EXAMPLES:');
console.log('• "OMG, your energy will guide you..."');
console.log('• "Today brings energy, LITERALLY amazing!"');
console.log('• "Trust your instincts, FR FR!"');
