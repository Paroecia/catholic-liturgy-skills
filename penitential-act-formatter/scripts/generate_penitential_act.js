#!/usr/bin/env node
/**
 * Generates a Penitential Act document in docx format
 * 
 * Usage: node generate_penitential_act.js <output_dir> <celebration> <season> <year> <invocation1> <invocation2> <invocation3> [priest_opening] [priest_closing]
 * 
 * Arguments:
 *   output_dir       - Directory to write the output file
 *   celebration      - Celebration name: ordinal for Sundays (e.g., "1st", "2nd") OR full name for feasts (e.g., "Solemnity of Mary, Mother of God")
 *   season           - Liturgical season (e.g., "Advent", "Lent", "Ordinary Time") OR empty string "" for named feasts
 *   year             - Liturgical year: A, B, or C
 *   invocation1      - First Deacon invocation text (Lord, have mercy)
 *   invocation2      - Second Deacon invocation text (Christ, have mercy)
 *   invocation3      - Third Deacon invocation text (Lord, have mercy)
 *   priest_opening   - (Optional) Custom priest opening text. If not provided, uses default.
 *   priest_closing   - (Optional) Custom priest closing prayer. If not provided, uses default.
 * 
 * Output: 
 *   For Sundays: Penitential Act_{ordinal} Sunday of {season}_{year}.docx
 *   For Feasts:  Penitential Act_{celebration}_{year}.docx
 */

const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

// Static text
const PRIEST_OPENING = "Brethren, let us acknowledge our sins and so prepare ourselves to celebrate the sacred mysteries.";
const PRIEST_CLOSING = "May almighty God have mercy on us, forgive us our sins, and bring us to everlasting life.";

// Rubric red color (traditional liturgical red)
const RUBRIC_RED = "C41E3A";

// Font configuration
const FONT_NAME = "Sabon Next LT";

/**
 * Determines if the celebration is a Sunday (ordinal) or a named feast
 */
function isSundayCelebration(celebration) {
  // Ordinals like "1st", "2nd", "3rd", "14th", etc.
  return /^\d+(st|nd|rd|th)$/i.test(celebration.trim());
}

/**
 * Formats the celebration title based on type
 */
function formatCelebrationTitle(celebration, season) {
  if (isSundayCelebration(celebration)) {
    return `${celebration} Sunday of ${season}`;
  }
  // Named feast - use as-is
  return celebration;
}

/**
 * Creates a role label paragraph (Priest/Deacon) in red
 */
function createRoleLabel(role, fontSize) {
  return new Paragraph({
    spacing: { before: 240, after: 60 },
    children: [
      new TextRun({
        text: role,
        font: FONT_NAME,
        size: fontSize,
        color: RUBRIC_RED,
        bold: true
      })
    ]
  });
}

/**
 * Creates a spoken text paragraph in black
 */
function createSpokenText(text, fontSize) {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({
        text: text,
        font: FONT_NAME,
        size: fontSize,
        color: "000000"
      })
    ]
  });
}

/**
 * Creates the mercy response paragraph in black
 */
function createMercyResponse(response, fontSize) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: response,
        font: FONT_NAME,
        size: fontSize,
        color: "000000"
      })
    ]
  });
}

/**
 * Creates the document title paragraph
 */
function createTitle(celebration, season, year, fontSize) {
  const celebrationTitle = formatCelebrationTitle(celebration, season);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 360 },
    children: [
      new TextRun({
        text: `Penitential Act – ${celebrationTitle}, Year ${year}`,
        font: FONT_NAME,
        size: fontSize,
        color: "000000",
        bold: true
      })
    ]
  });
}

/**
 * Creates the complete document structure
 */
function createPenitentialActDocument(invocations, celebration, season, year, fontSize, priestOpening, priestClosing) {
  const children = [
    // Title
    createTitle(celebration, season, year, fontSize),
    
    // Priest opening
    createRoleLabel("Priest", fontSize),
    createSpokenText(priestOpening, fontSize),
    
    // Deacon invocations
    createRoleLabel("Deacon", fontSize),
    createSpokenText(invocations[0], fontSize),
    createMercyResponse("Lord, have mercy.", fontSize),
    
    createRoleLabel("Deacon", fontSize),
    createSpokenText(invocations[1], fontSize),
    createMercyResponse("Christ, have mercy.", fontSize),
    
    createRoleLabel("Deacon", fontSize),
    createSpokenText(invocations[2], fontSize),
    createMercyResponse("Lord, have mercy.", fontSize),
    
    // Priest closing
    createRoleLabel("Priest", fontSize),
    createSpokenText(priestClosing, fontSize)
  ];

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 } // 0.5 inch margins (720 = 0.5 * 1440)
        }
      },
      children: children
    }]
  });
}

/**
 * Calculates font size to maximize readability while fitting on one page
 */
function calculateFontSize(invocations, celebration, season, year, priestOpening, priestClosing) {
  const celebrationTitle = formatCelebrationTitle(celebration, season);
  const title = `Penitential Act – ${celebrationTitle}, Year ${year}`;
  const allText = [
    title,
    priestOpening,
    invocations[0], "Lord, have mercy.",
    invocations[1], "Christ, have mercy.",
    invocations[2], "Lord, have mercy.",
    priestClosing
  ];
  
  const totalChars = allText.reduce((sum, t) => sum + t.length, 0);
  const numParagraphs = 14; // 1 title + 5 role labels + 8 text paragraphs
  
  // Available height: 10 inches = 720pt (with 0.5" margins)
  const availableHeight = 720;
  
  // Try different font sizes from large to small
  // Font sizes in half-points (docx uses half-points)
  const fontSizes = [56, 52, 48, 44, 40, 38, 36, 34, 32, 30, 28, 26, 24];
  
  for (const fontSize of fontSizes) {
    const ptSize = fontSize / 2;
    const lineHeight = ptSize * 1.25;
    const charsPerLine = Math.floor(540 / (ptSize * 0.55));
    
    let totalLines = 0;
    for (const text of allText) {
      totalLines += Math.ceil(text.length / charsPerLine);
    }
    
    const paragraphSpacing = numParagraphs * (lineHeight * 0.5);
    const estimatedHeight = (totalLines * lineHeight) + paragraphSpacing;
    
    if (estimatedHeight <= availableHeight) {
      return fontSize;
    }
  }
  
  return 24; // Minimum 12pt
}

/**
 * Sanitizes celebration name for use in filename
 */
function sanitizeForFilename(text) {
  return text
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename chars
    .replace(/,/g, '')            // Remove commas
    .trim();
}

/**
 * Generates the output filename
 */
function generateFilename(celebration, season, year) {
  const celebrationTitle = formatCelebrationTitle(celebration, season);
  const sanitized = sanitizeForFilename(celebrationTitle);
  return `Penitential Act_${sanitized}_${year}.docx`;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 7) {
    console.error("Usage: node generate_penitential_act.js <output_dir> <celebration> <season> <year> <invocation1> <invocation2> <invocation3> [priest_opening] [priest_closing]");
    console.error("");
    console.error("For Sundays:");
    console.error('  node generate_penitential_act.js ./output "1st" "Advent" "A" "inv1" "inv2" "inv3"');
    console.error("");
    console.error("For Named Feasts:");
    console.error('  node generate_penitential_act.js ./output "Solemnity of Mary, Mother of God" "" "C" "inv1" "inv2" "inv3"');
    console.error("");
    console.error("With custom priest texts:");
    console.error('  node generate_penitential_act.js ./output "1st" "Advent" "A" "inv1" "inv2" "inv3" "Custom opening" "Custom closing"');
    process.exit(1);
  }
  
  const [outputDir, celebration, season, year, inv1, inv2, inv3, priestOpening, priestClosing] = args;
  const invocations = [inv1, inv2, inv3];
  
  // Use default texts if custom ones not provided
  const finalPriestOpening = priestOpening || PRIEST_OPENING;
  const finalPriestClosing = priestClosing || PRIEST_CLOSING;
  
  // Validate year
  if (!['A', 'B', 'C'].includes(year.toUpperCase())) {
    console.error("Error: Year must be A, B, or C");
    process.exit(1);
  }
  
  // Validate that Sundays have a season
  if (isSundayCelebration(celebration) && !season.trim()) {
    console.error("Error: Sunday celebrations require a season (e.g., 'Advent', 'Lent', 'Ordinary Time')");
    process.exit(1);
  }
  
  // Calculate optimal font size
  const fontSize = calculateFontSize(invocations, celebration, season, year.toUpperCase(), finalPriestOpening, finalPriestClosing);
  
  // Create document
  const doc = createPenitentialActDocument(invocations, celebration, season, year.toUpperCase(), fontSize, finalPriestOpening, finalPriestClosing);
  
  // Generate filename and full path
  const filename = generateFilename(celebration, season, year.toUpperCase());
  const outputPath = path.join(outputDir, filename);
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write document
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Generated: ${outputPath}`);
  console.log(`Font size: ${fontSize / 2}pt`);
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
