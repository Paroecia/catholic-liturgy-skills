#!/usr/bin/env node
/**
 * Tests for the Penitential Act document generator (updated version)
 * 
 * Run with: node test_generate_penitential_act.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const SCRIPT_PATH = path.join(__dirname, 'generate_penitential_act.js');
const TEST_OUTPUT_DIR = '/tmp/penitential-act-tests';

// Test invocations (short, one sentence each)
const TEST_INVOCATIONS = [
  "Lord Jesus, you are the shepherd promised from Bethlehem:",
  "Christ Jesus, your hidden presence stirs joy in faithful hearts:",
  "Lord Jesus, you bless all who believe your promises:"
];

// Custom priest texts for testing
const CUSTOM_PRIEST_OPENING = "Dear friends, as we prepare to celebrate these sacred mysteries, let us acknowledge our need for God's mercy.";
const CUSTOM_PRIEST_CLOSING = "May God in his infinite mercy forgive us our sins and lead us to eternal life.";

// Clean up and create test directory
function setup() {
  if (fs.existsSync(TEST_OUTPUT_DIR)) {
    fs.rmSync(TEST_OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
}

// Run the generator script
function runGenerator(outputDir, celebration, season, year, inv1, inv2, inv3, priestOpening = null, priestClosing = null) {
  let cmd = `node "${SCRIPT_PATH}" "${outputDir}" "${celebration}" "${season}" "${year}" "${inv1}" "${inv2}" "${inv3}"`;
  if (priestOpening !== null) {
    cmd += ` "${priestOpening}"`;
  }
  if (priestClosing !== null) {
    cmd += ` "${priestClosing}"`;
  }
  return execSync(cmd, { encoding: 'utf-8' });
}

// Test 1: Basic Sunday generation (existing functionality)
function testSundayGeneration() {
  console.log("Test 1: Sunday generation (1st Sunday of Advent, Year A)...");
  
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
  
  console.log("  ✓ Passed");
}

// Test 2: Named feast - Solemnity of Mary
function testSolemnityOfMary() {
  console.log("Test 2: Named feast (Solemnity of Mary, Mother of God)...");
  
  const output = runGenerator(
    TEST_OUTPUT_DIR,
    "Solemnity of Mary, Mother of God",
    "",  // Empty season for named feasts
    "C",
    "Lord Jesus, born of the Virgin Mary to make us children of God:",
    "Christ Jesus, your name means salvation for all who call on you:",
    "Lord Jesus, you hear your people through your Mother's prayers:"
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_Solemnity of Mary Mother of God_C.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  
  console.log("  ✓ Passed");
}

// Test 3: Named feast - Ascension
function testAscension() {
  console.log("Test 3: Named feast (Ascension of the Lord)...");
  
  runGenerator(
    TEST_OUTPUT_DIR,
    "Ascension of the Lord",
    "",
    "B",
    "Lord Jesus, you ascended to the Father to prepare a place for us:",
    "Christ Jesus, you reign at the right hand of the Father:",
    "Lord Jesus, you will come again in glory:"
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_Ascension of the Lord_B.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  
  console.log("  ✓ Passed");
}

// Test 4: Named feast - Christmas
function testChristmasDay() {
  console.log("Test 4: Named feast (Nativity of the Lord)...");
  
  runGenerator(
    TEST_OUTPUT_DIR,
    "Nativity of the Lord",
    "",
    "A",
    "Lord Jesus, you are the Word made flesh:",
    "Christ Jesus, you are the light shining in the darkness:",
    "Lord Jesus, you came to dwell among us:"
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_Nativity of the Lord_A.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  
  console.log("  ✓ Passed");
}

// Test 5: Ordinary Time Sunday (multi-word season)
function testOrdinaryTimeSunday() {
  console.log("Test 5: Ordinary Time Sunday (14th Sunday)...");
  
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

// Test 6: Lowercase year normalization
function testLowercaseYear() {
  console.log("Test 6: Lowercase year normalization...");
  
  runGenerator(
    TEST_OUTPUT_DIR,
    "2nd",
    "Lent",
    "b",  // lowercase
    TEST_INVOCATIONS[0],
    TEST_INVOCATIONS[1],
    TEST_INVOCATIONS[2]
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_2nd Sunday of Lent_B.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  
  console.log("  ✓ Passed");
}

// Test 7: Invalid year rejection
function testInvalidYear() {
  console.log("Test 7: Invalid year rejection...");
  
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

// Test 8: Sunday without season should fail
function testSundayWithoutSeason() {
  console.log("Test 8: Sunday without season rejection...");
  
  let threw = false;
  try {
    runGenerator(
      TEST_OUTPUT_DIR,
      "1st",
      "",  // Missing season for Sunday
      "A",
      TEST_INVOCATIONS[0],
      TEST_INVOCATIONS[1],
      TEST_INVOCATIONS[2]
    );
  } catch (e) {
    threw = true;
  }
  
  assert(threw, "Should have thrown error for Sunday without season");
  
  console.log("  ✓ Passed");
}

// Test 9: Missing arguments rejection
function testMissingArguments() {
  console.log("Test 9: Missing arguments rejection...");
  
  let threw = false;
  try {
    execSync(`node "${SCRIPT_PATH}" "${TEST_OUTPUT_DIR}" "1st" "Advent"`, { encoding: 'utf-8' });
  } catch (e) {
    threw = true;
  }
  
  assert(threw, "Should have thrown error for missing arguments");
  
  console.log("  ✓ Passed");
}

// Test 10: Verify docx file structure
function testDocxStructure() {
  console.log("Test 10: Verify docx file is valid ZIP structure...");
  
  const testFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_1st Sunday of Advent_A.docx");
  
  const fd = fs.openSync(testFile, 'r');
  const buffer = Buffer.alloc(4);
  fs.readSync(fd, buffer, 0, 4, 0);
  fs.closeSync(fd);
  
  assert(buffer[0] === 0x50 && buffer[1] === 0x4B, "File should be a valid ZIP (docx) file");
  
  console.log("  ✓ Passed");
}

// Test 11: Special characters in feast name (filename sanitization)
function testFilenameSpecialChars() {
  console.log("Test 11: Filename sanitization for special characters...");
  
  runGenerator(
    TEST_OUTPUT_DIR,
    "Feast of St. John the Baptist",
    "",
    "A",
    TEST_INVOCATIONS[0],
    TEST_INVOCATIONS[1],
    TEST_INVOCATIONS[2]
  );
  
  // Should create file without issues
  const files = fs.readdirSync(TEST_OUTPUT_DIR);
  const matchingFile = files.find(f => f.includes("St. John"));
  assert(matchingFile, "Should create file with feast name");
  
  console.log("  ✓ Passed");
}

// Test 12: Custom priest opening only
function testCustomPriestOpening() {
  console.log("Test 12: Custom priest opening only...");
  
  runGenerator(
    TEST_OUTPUT_DIR,
    "3rd",
    "Advent",
    "B",
    TEST_INVOCATIONS[0],
    TEST_INVOCATIONS[1],
    TEST_INVOCATIONS[2],
    CUSTOM_PRIEST_OPENING
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_3rd Sunday of Advent_B.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  
  console.log("  ✓ Passed");
}

// Test 13: Custom priest closing only
function testCustomPriestClosing() {
  console.log("Test 13: Custom priest closing only...");
  
  runGenerator(
    TEST_OUTPUT_DIR,
    "4th",
    "Lent",
    "C",
    TEST_INVOCATIONS[0],
    TEST_INVOCATIONS[1],
    TEST_INVOCATIONS[2],
    null,
    CUSTOM_PRIEST_CLOSING
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_4th Sunday of Lent_C.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  
  console.log("  ✓ Passed");
}

// Test 14: Both custom priest opening and closing
function testCustomPriestBoth() {
  console.log("Test 14: Both custom priest opening and closing...");
  
  runGenerator(
    TEST_OUTPUT_DIR,
    "Epiphany of the Lord",
    "",
    "A",
    TEST_INVOCATIONS[0],
    TEST_INVOCATIONS[1],
    TEST_INVOCATIONS[2],
    CUSTOM_PRIEST_OPENING,
    CUSTOM_PRIEST_CLOSING
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_Epiphany of the Lord_A.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  
  console.log("  ✓ Passed");
}

// Test 15: Very long custom texts (font size adjustment test)
function testLongCustomTexts() {
  console.log("Test 15: Very long custom priest texts (font size adjustment)...");
  
  const longOpening = "Beloved brothers and sisters in Christ, as we gather here today in the presence of the Lord to celebrate these most sacred and holy mysteries, let us pause for a moment to acknowledge before God and one another our sins, our failings, and our deep need for divine mercy and forgiveness.";
  const longClosing = "May almighty God, in his infinite wisdom, boundless compassion, and unfailing love, have mercy on us, forgive us all our sins both known and unknown, heal the wounds of our past transgressions, and bring us safely to the joy of everlasting life in his heavenly kingdom.";
  
  runGenerator(
    TEST_OUTPUT_DIR,
    "5th",
    "Easter",
    "C",
    TEST_INVOCATIONS[0],
    TEST_INVOCATIONS[1],
    TEST_INVOCATIONS[2],
    longOpening,
    longClosing
  );
  
  const expectedFile = path.join(TEST_OUTPUT_DIR, "Penitential Act_5th Sunday of Easter_C.docx");
  assert(fs.existsSync(expectedFile), `Expected file not found: ${expectedFile}`);
  
  console.log("  ✓ Passed");
}

// Main test runner
function runTests() {
  console.log("=".repeat(60));
  console.log("Penitential Act Generator Tests (Updated for Non-Sundays)");
  console.log("=".repeat(60));
  console.log("");
  
  setup();
  
  const tests = [
    testSundayGeneration,
    testSolemnityOfMary,
    testAscension,
    testChristmasDay,
    testOrdinaryTimeSunday,
    testLowercaseYear,
    testInvalidYear,
    testSundayWithoutSeason,
    testMissingArguments,
    testDocxStructure,
    testFilenameSpecialChars,
    testCustomPriestOpening,
    testCustomPriestClosing,
    testCustomPriestBoth,
    testLongCustomTexts
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
  console.log("=".repeat(60));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log("=".repeat(60));
  
  // Cleanup
  if (fs.existsSync(TEST_OUTPUT_DIR)) {
    fs.rmSync(TEST_OUTPUT_DIR, { recursive: true });
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
