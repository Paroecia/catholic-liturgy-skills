#!/usr/bin/env node
/**
 * Tests for the Penitential Act document generator
 * 
 * Run with: node test_generate_penitential_act.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const SCRIPT_PATH = path.join(__dirname, 'generate_penitential_act.js');
const TEST_OUTPUT_DIR = '/tmp/penitential-act-tests';

// Test invocations (from user's example)
const TEST_INVOCATIONS = [
  "You open the eyes of those who cannot see your presence among us:",
  "You teach us to wait with patient hearts for your kingdom:",
  "Your coming to fill us with joy is close at hand:"
];

// Clean up and create test directory
function setup() {
  if (fs.existsSync(TEST_OUTPUT_DIR)) {
    fs.rmSync(TEST_OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
}

// Run the generator script
function runGenerator(outputDir, sunday, season, year, inv1, inv2, inv3) {
  const cmd = `node "${SCRIPT_PATH}" "${outputDir}" "${sunday}" "${season}" "${year}" "${inv1}" "${inv2}" "${inv3}"`;
  return execSync(cmd, { encoding: 'utf-8' });
}

// Test 1: Basic generation with Year A
function testBasicGenerationYearA() {
  console.log("Test 1: Basic generation with Year A...");
  
  const output = runGenerator(
    TEST_OUTPUT_DIR,
    "1st",
    "Advent",
    "A",
    TEST_INVOCATIONS[0],
    TEST_INVOCATIONS[1],
    TEST_INVOCATIONS[2]
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_1st Sunday of Advent_A.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  assert(output.includes("Generated:"), "Output should confirm generation");
  
  // Check file is not empty
  const stats = fs.statSync(expectedFile);
  assert(stats.size > 1000, "Generated file seems too small");
  
  console.log("  ✓ Passed");
}

// Test 2: Generation with Year B
function testGenerationYearB() {
  console.log("Test 2: Generation with Year B...");
  
  runGenerator(
    TEST_OUTPUT_DIR,
    "2nd",
    "Lent",
    "B",
    TEST_INVOCATIONS[0],
    TEST_INVOCATIONS[1],
    TEST_INVOCATIONS[2]
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_2nd Sunday of Lent_B.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  
  console.log("  ✓ Passed");
}

// Test 3: Generation with Year C
function testGenerationYearC() {
  console.log("Test 3: Generation with Year C...");
  
  runGenerator(
    TEST_OUTPUT_DIR,
    "3rd",
    "Easter",
    "C",
    TEST_INVOCATIONS[0],
    TEST_INVOCATIONS[1],
    TEST_INVOCATIONS[2]
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_3rd Sunday of Easter_C.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  
  console.log("  ✓ Passed");
}

// Test 4: Ordinary Time with multi-word season name
function testOrdinaryTime() {
  console.log("Test 4: Ordinary Time (multi-word season)...");
  
  runGenerator(
    TEST_OUTPUT_DIR,
    "14th",
    "Ordinary Time",
    "A",
    TEST_INVOCATIONS[0],
    TEST_INVOCATIONS[1],
    TEST_INVOCATIONS[2]
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_14th Sunday of Ordinary Time_A.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  
  console.log("  ✓ Passed");
}

// Test 5: Lowercase year should be normalized to uppercase
function testLowercaseYear() {
  console.log("Test 5: Lowercase year normalization...");
  
  runGenerator(
    TEST_OUTPUT_DIR,
    "1st",
    "Christmas",
    "b",  // lowercase
    TEST_INVOCATIONS[0],
    TEST_INVOCATIONS[1],
    TEST_INVOCATIONS[2]
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_1st Sunday of Christmas_B.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  
  console.log("  ✓ Passed");
}

// Test 6: Invalid year should fail
function testInvalidYear() {
  console.log("Test 6: Invalid year rejection...");
  
  let threw = false;
  try {
    runGenerator(
      TEST_OUTPUT_DIR,
      "1st",
      "Advent",
      "D",  // Invalid
      TEST_INVOCATIONS[0],
      TEST_INVOCATIONS[1],
      TEST_INVOCATIONS[2]
    );
  } catch (e) {
    threw = true;
  }
  
  assert(threw, "Should have thrown error for invalid year");
  
  console.log("  ✓ Passed");
}

// Test 7: Long invocations (font size adjustment)
function testLongInvocations() {
  console.log("Test 7: Long invocations (font size adjustment)...");
  
  const longInvocations = [
    "You come to bring sight to the blind and hearing to the deaf, opening our hearts to receive your eternal message of salvation and love:",
    "You teach us through your sacred word to wait with patient hearts, trusting in your promise that your kingdom will come in glory:",
    "Your coming to fill us with the joy of your presence is close at hand, bringing hope to those who dwell in darkness and shadow:"
  ];
  
  const output = runGenerator(
    TEST_OUTPUT_DIR,
    "4th",
    "Advent",
    "A",
    longInvocations[0],
    longInvocations[1],
    longInvocations[2]
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_4th Sunday of Advent_A.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  
  // Check that font size was reduced (output includes font size info)
  assert(output.includes("Font size:"), "Output should include font size");
  
  console.log("  ✓ Passed");
}

// Test 8: Missing arguments should fail
function testMissingArguments() {
  console.log("Test 8: Missing arguments rejection...");
  
  let threw = false;
  try {
    execSync(`node "${SCRIPT_PATH}" "${TEST_OUTPUT_DIR}" "1st" "Advent"`, { encoding: 'utf-8' });
  } catch (e) {
    threw = true;
  }
  
  assert(threw, "Should have thrown error for missing arguments");
  
  console.log("  ✓ Passed");
}

// Test 9: Verify docx file structure (basic validation)
function testDocxStructure() {
  console.log("Test 9: Verify docx file is valid ZIP structure...");
  
  const testFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_1st Sunday of Advent_A.docx");
  
  // Read first bytes to check for ZIP signature (PK)
  const fd = fs.openSync(testFile, 'r');
  const buffer = Buffer.alloc(4);
  fs.readSync(fd, buffer, 0, 4, 0);
  fs.closeSync(fd);
  
  // ZIP files start with PK (0x50, 0x4B)
  assert(buffer[0] === 0x50 && buffer[1] === 0x4B, "File should be a valid ZIP (docx) file");
  
  console.log("  ✓ Passed");
}

// Main test runner
function runTests() {
  console.log("=".repeat(50));
  console.log("Penitential Act Generator Tests");
  console.log("=".repeat(50));
  console.log("");
  
  setup();
  
  const tests = [
    testBasicGenerationYearA,
    testGenerationYearB,
    testGenerationYearC,
    testOrdinaryTime,
    testLowercaseYear,
    testInvalidYear,
    testLongInvocations,
    testMissingArguments,
    testDocxStructure
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      test();
      passed++;
    } catch (e) {
      console.log(`  ✗ FAILED: ${e.message}`);
      failed++;
    }
  }
  
  console.log("");
  console.log("=".repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log("=".repeat(50));
  
  // Cleanup
  if (fs.existsSync(TEST_OUTPUT_DIR)) {
    fs.rmSync(TEST_OUTPUT_DIR, { recursive: true });
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
