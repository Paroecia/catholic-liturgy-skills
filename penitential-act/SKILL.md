---
name: penitential-act
description: Generates formatted Catholic Penitential Act documents (.docx) from invocation text. Use when creating worship aids or Mass materials that need the Penitential Act (Form C - with tropes) formatted with proper liturgical styling (red rubrics, black text, Sabon Next LT font). Expects three Deacon invocations and conversation context containing Sunday (ordinal), Season, and Year (A/B/C).
---

# Penitential Act Document Generator

Creates properly formatted Penitential Act documents following the "say the black, do the red" paradigm.

## Document Structure

The generated document contains:
1. **Priest** (red): Static opening - "Brethren, let us acknowledge our sins..."
2. **Deacon** (red): First invocation (provided) + "Lord, have mercy." (black)
3. **Deacon** (red): Second invocation (provided) + "Christ, have mercy." (black)
4. **Deacon** (red): Third invocation (provided) + "Lord, have mercy." (black)
5. **Priest** (red): Static closing - "May almighty God have mercy on us..."

## Input Requirements

Extract from the conversation:
- **Three invocations**: The Deacon's trope text (without the "Lord/Christ, have mercy" response)
- **Sunday**: Ordinal form (e.g., "1st", "2nd", "3rd", "14th")
- **Season**: Liturgical season (e.g., "Advent", "Lent", "Easter", "Ordinary Time", "Christmas")
- **Year**: Liturgical year - must be A, B, or C

## Usage

```bash
node scripts/generate_penitential_act.js <output_dir> <sunday> <season> <year> <invocation1> <invocation2> <invocation3>
```

### Example

Given input:
```
Deacon/Priest: You open the eyes of those who cannot see your presence among us: Lord, have mercy. 
Deacon/Priest: You teach us to wait with patient hearts for your kingdom: Christ, have mercy.
Deacon/Priest: Your coming to fill us with joy is close at hand: Lord, have mercy.
```

For the 1st Sunday of Advent, Year A:

```bash
node scripts/generate_penitential_act.js /mnt/user-data/outputs "1st" "Advent" "A" \
  "You open the eyes of those who cannot see your presence among us:" \
  "You teach us to wait with patient hearts for your kingdom:" \
  "Your coming to fill us with joy is close at hand:"
```

Output: `Penitential Act_1st Sunday of Advent_A.docx`

## Formatting Details

- **Font**: Sabon Next LT
- **Colors**: Red (#C41E3A) for role labels (Priest, Deacon), black for spoken text
- **Font size**: Automatically calculated to maximize readability while fitting on one page
- **Page**: Letter size with 0.5" margins

## Parsing Input

When the user provides invocations in the format:
```
Deacon/Priest: [invocation text]: Lord, have mercy. People: Lord, have mercy.
```

Extract only the invocation text portion (before "Lord, have mercy" or "Christ, have mercy").
