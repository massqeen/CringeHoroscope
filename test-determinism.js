// Comprehensive test of the determinism and PRNG system
import { generateDeterministicSeed, generateRandomSeed, mulberry32, PRNG } from './src/utils/prng.ts';
import { generateRoast } from './src/services/roastGenerator.ts';

console.log('🎲 COMPREHENSIVE DETERMINISM & PRNG TESTING');
console.log('='.repeat(60));

// Test 1: Deterministic Seed Generation
console.log('\n📐 TEST 1: Deterministic Seed Generation');
console.log('-'.repeat(40));

const testParams = [
  { sign: 'aries', date: '2025-08-20', cringe: 0 },
  { sign: 'aries', date: '2025-08-20', cringe: 1 },
  { sign: 'aries', date: '2025-08-21', cringe: 1 },
  { sign: 'scorpio', date: '2025-08-20', cringe: 1 },
];

testParams.forEach((params, i) => {
  const seed1 = generateDeterministicSeed(params.sign, params.date, params.cringe);
  const seed2 = generateDeterministicSeed(params.sign, params.date, params.cringe);
  const formula = `${params.sign}|${params.date}|${params.cringe}`;
  
  console.log(`Test ${i + 1}: ${formula}`);
  console.log(`  Seed 1: ${seed1}`);
  console.log(`  Seed 2: ${seed2}`);
  console.log(`  Consistent: ${seed1 === seed2 ? '✅' : '❌'}`);
});

// Test 2: Random Seed Generation
console.log('\n🎲 TEST 2: Random Seed Generation');
console.log('-'.repeat(40));

const randomSeeds = Array.from({ length: 5 }, () => generateRandomSeed());
console.log('Random seeds:', randomSeeds);
console.log('All different:', new Set(randomSeeds).size === randomSeeds.length ? '✅' : '❌');

// Test 3: Mulberry32 vs PRNG Class Consistency
console.log('\n🔄 TEST 3: Mulberry32 vs PRNG Class Consistency');
console.log('-'.repeat(40));

const testSeed = 12345;
const rng1 = mulberry32(testSeed);
const prng = new PRNG(testSeed);

const sequence1 = Array.from({ length: 10 }, () => rng1());
const sequence2 = Array.from({ length: 10 }, () => prng.next());

console.log('Mulberry32 sequence:', sequence1.map(n => n.toFixed(6)));
console.log('PRNG class sequence:', sequence2.map(n => n.toFixed(6)));
console.log('Sequences match:', JSON.stringify(sequence1) === JSON.stringify(sequence2) ? '✅' : '❌');

// Test 4: PRNG Class Methods
console.log('\n🛠️ TEST 4: PRNG Class Methods');
console.log('-'.repeat(40));

const prngTest = new PRNG(42);
console.log('next():', prngTest.next().toFixed(6));
console.log('nextInt(1, 10):', prngTest.nextInt(1, 10));
console.log('choose([a,b,c,d]):', prngTest.choose(['a', 'b', 'c', 'd']));
console.log('probability(0.7):', prngTest.probability(0.7));

// Test 5: Roast Generation Consistency
console.log('\n🔥 TEST 5: Roast Generation Consistency');
console.log('-'.repeat(40));

const roastSeed = generateDeterministicSeed('cancer', '2025-08-20', 2);
console.log(`Using seed: ${roastSeed} (cancer|2025-08-20|2)`);

const roastResults = [];
for (let i = 0; i < 3; i++) {
  const roast = generateRoast({
    sign: 'cancer',
    day: 'today',
    cringe: 2,
    seed: roastSeed
  });
  roastResults.push(roast.text);
  console.log(`Attempt ${i + 1}: ${roast.text.substring(0, 50)}...`);
}

const allSame = roastResults.every(result => result === roastResults[0]);
console.log(`All roasts identical: ${allSame ? '✅' : '❌'}`);

// Test 6: Different Seeds → Different Results
console.log('\n🎯 TEST 6: Different Seeds → Different Results');
console.log('-'.repeat(40));

const differentSeeds = [
  generateDeterministicSeed('aries', '2025-08-20', 1),
  generateDeterministicSeed('aries', '2025-08-21', 1),
  generateDeterministicSeed('taurus', '2025-08-20', 1),
  generateDeterministicSeed('aries', '2025-08-20', 2),
];

const differentResults = differentSeeds.map((seed, i) => {
  const roast = generateRoast({
    sign: 'aries',
    day: 'today', 
    cringe: 1,
    seed
  });
  console.log(`Seed ${i + 1} (${seed}): ${roast.text.substring(0, 40)}...`);
  return roast.text;
});

const allDifferent = new Set(differentResults).size === differentResults.length;
console.log(`All results different: ${allDifferent ? '✅' : '❌'}`);

// Test 7: Edge Cases
console.log('\n⚠️ TEST 7: Edge Cases');
console.log('-'.repeat(40));

// Empty/special characters in seed formula
try {
  const edgeSeed1 = generateDeterministicSeed('', '2025-08-20', 0);
  console.log('Empty sign seed:', edgeSeed1);
} catch (e) {
  console.log('Empty sign error:', e.message);
}

// Very large cringe values
try {
  const edgeSeed2 = generateDeterministicSeed('aries', '2025-08-20', 999);
  console.log('Large cringe seed:', edgeSeed2);
} catch (e) {
  console.log('Large cringe error:', e.message);
}

// Test 8: Performance Benchmark
console.log('\n⚡ TEST 8: Performance Benchmark');
console.log('-'.repeat(40));

const startTime = performance.now();
const iterations = 10000;

for (let i = 0; i < iterations; i++) {
  const seed = generateDeterministicSeed('aries', '2025-08-20', 1);
  const rng = mulberry32(seed);
  rng(); // Generate one number
}

const endTime = performance.now();
console.log(`Generated ${iterations} seeds + random numbers in ${(endTime - startTime).toFixed(2)}ms`);
console.log(`Average: ${((endTime - startTime) / iterations).toFixed(4)}ms per operation`);

console.log('\n🎉 DETERMINISM TESTING COMPLETE!');
console.log('='.repeat(60));
