#!/usr/bin/env node
/**
 * Generates a Penitential Act document in docx format
 * 
 * Usage: node generate_penitential_act.js <output_dir> <sunday> <season> <year> <invocation1> <invocation2> <invocation3>
 * 
 * Arguments:
 *   output_dir   - Directory to write the output file
 *   sunday       - Ordinal (e.g., "1st", "2nd", "3rd")
 *   season       - Liturgical season (e.g., "Advent", "Lent", "Ordinary Time")
 *   year         - Liturgical year: A, B, or C
 *   invocation1  - First Deacon invocation text (Lord, have mercy)
 *   invocation2  - Second Deacon invocation text (Christ, have mercy)
 *   invocation3  - Third Deacon invocation text (Lord, have mercy)
 * 
 * Output: Penitential Act_{sunday} of {season}_{year}.docx
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
function createTitle(sunday, season, year, fontSize) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 360 },
    children: [
      new TextRun({
        text: `Penitential Act – ${sunday} Sunday of ${season}, Year ${year}`,
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
function createPenitentialActDocument(invocations, sunday, season, year, fontSize) {
  const children = [
    // Title
    createTitle(sunday, season, year, fontSize),
    
    // Priest opening
    createRoleLabel("Priest", fontSize),
    createSpokenText(PRIEST_OPENING, fontSize),
    
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
    createSpokenText(PRIEST_CLOSING, fontSize)
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
 * 
 * Letter paper: 11" height - 1" margins (0.5" each side) = 10" usable = ~720pt
 * Each line at a given font size takes approximately fontSize * 1.25 in height
 * Plus paragraph spacing adds extra height per paragraph
 * 
 * The document has 14 paragraphs (1 title + 5 role labels + 8 text paragraphs)
 * At width 7.5" (540pt), we can estimate characters per line
 */
function calculateFontSize(invocations, sunday, season, year) {
  // Total text content including title
  const title = `Penitential Act – ${sunday} Sunday of ${season}, Year ${year}`;
  const allText = [
    title,
    PRIEST_OPENING,
    invocations[0], "Lord, have mercy.",
    invocations[1], "Christ, have mercy.",
    invocations[2], "Lord, have mercy.",
    PRIEST_CLOSING
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
    const lineHeight = ptSize * 1.25; // Line height with some spacing
    const charsPerLine = Math.floor(540 / (ptSize * 0.55)); // Approximate chars per line (7.5" width)
    
    // Estimate total lines needed
    let totalLines = 0;
    for (const text of allText) {
      totalLines += Math.ceil(text.length / charsPerLine);
    }
    
    // Add spacing for paragraphs (approximately 0.5 lines per paragraph)
    const paragraphSpacing = numParagraphs * (lineHeight * 0.5);
    
    const estimatedHeight = (totalLines * lineHeight) + paragraphSpacing;
    
    if (estimatedHeight <= availableHeight) {
      return fontSize;
    }
  }
  
  return 24; // Minimum 12pt
}

/**
 * Generates the output filename
 */
function generateFilename(sunday, season, year) {
  return `Penitential Act_${sunday} Sunday of ${season}_${year}.docx`;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 7) {
    console.error("Usage: node generate_penitential_act.js <output_dir> <sunday> <season> <year> <invocation1> <invocation2> <invocation3>");
    console.error("Example: node generate_penitential_act.js ./output \"1st\" \"Advent\" \"A\" \"You open the eyes...\" \"You teach us...\" \"Your coming...\"");
    process.exit(1);
  }
  
  const [outputDir, sunday, season, year, inv1, inv2, inv3] = args;
  const invocations = [inv1, inv2, inv3];
  
  // Validate year
  if (!['A', 'B', 'C'].includes(year.toUpperCase())) {
    console.error("Error: Year must be A, B, or C");
    process.exit(1);
  }
  
  // Calculate optimal font size
  const fontSize = calculateFontSize(invocations, sunday, season, year.toUpperCase());
  
  // Create document
  const doc = createPenitentialActDocument(invocations, sunday, season, year.toUpperCase(), fontSize);
  
  // Generate filename and full path
  const filename = generateFilename(sunday, season, year.toUpperCase());
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
