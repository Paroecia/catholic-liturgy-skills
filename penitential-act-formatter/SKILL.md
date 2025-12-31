---
name: penitential-act-formatter
description: Generates formatted Catholic Penitential Act documents (.docx) from invocation text. Use when creating worship aids or Mass materials that need the Penitential Act (Form C - with tropes) formatted with proper liturgical styling (red rubrics, black text, Sabon Next LT font). Expects three Deacon invocations plus celebration info (Sunday ordinal with season, OR named feast) and Year (A/B/C). Optionally accepts custom priest opening and closing prayer texts.
---

# Penitential Act Document Generator

Creates properly formatted Penitential Act documents following the "say the black, do the red" paradigm.

## Document Structure

The generated document contains:
1. **Priest** (red): Opening invocation (default or custom) 
2. **Deacon** (red): First invocation (provided) + "Lord, have mercy." (black)
3. **Deacon** (red): Second invocation (provided) + "Christ, have mercy." (black)
4. **Deacon** (red): Third invocation (provided) + "Lord, have mercy." (black)
5. **Priest** (red): Closing absolution prayer (default or custom)

Default texts:
- **Opening**: "Brethren, let us acknowledge our sins and so prepare ourselves to celebrate the sacred mysteries."
- **Closing**: "May almighty God have mercy on us, forgive us our sins, and bring us to everlasting life."

## Input Requirements

Extract from the conversation:
- **Three invocations**: The Deacon's trope text (without the "Lord/Christ, have mercy" response)
- **Celebration**: Either:
  - **Sunday ordinal** (e.g., "1st", "2nd", "3rd", "14th") with a **season**
  - **Named feast** (e.g., "Solemnity of Mary, Mother of God", "Ascension of the Lord")
- **Season**: Required for Sundays (e.g., "Advent", "Lent", "Easter", "Ordinary Time", "Christmas"). Use empty string `""` for named feasts.
- **Year**: Liturgical year - must be A, B, or C
- **Priest opening** (optional): Custom priest opening invocation. If not provided, uses default text.
- **Priest closing** (optional): Custom priest absolution prayer. If not provided, uses default text.

## Usage

```bash
node scripts/generate_penitential_act.js <output_dir> <celebration> <season> <year> <invocation1> <invocation2> <invocation3> [priest_opening] [priest_closing]
```

### Example: Sunday (with defaults)

For the 4th Sunday of Advent, Year C:

```bash
node scripts/generate_penitential_act.js /mnt/user-data/outputs "4th" "Advent" "C" \
  "Lord Jesus, you are the shepherd promised from Bethlehem:" \
  "Christ Jesus, your hidden presence stirs joy in faithful hearts:" \
  "Lord Jesus, you bless all who believe your promises:"
```

Output: `Penitential Act_4th Sunday of Advent_C.docx`

### Example: Sunday (with custom priest texts)

For the 3rd Sunday of Lent, Year B, with custom priest opening and closing:

```bash
node scripts/generate_penitential_act.js /mnt/user-data/outputs "3rd" "Lent" "B" \
  "Lord Jesus, you offer living water to the thirsty:" \
  "Christ Jesus, you cleanse the temple of our hearts:" \
  "Lord Jesus, you are the resurrection and the life:" \
  "Dear friends, let us prepare our hearts to celebrate these sacred mysteries by acknowledging our sins." \
  "May God in his infinite mercy forgive us and lead us to eternal life."
```

Output: `Penitential Act_3rd Sunday of Lent_B.docx`

### Example: Named Feast

For the Solemnity of Mary, Mother of God, Year C:

```bash
node scripts/generate_penitential_act.js /mnt/user-data/outputs "Solemnity of Mary, Mother of God" "" "C" \
  "Lord Jesus, born of the Virgin Mary to make us children of God:" \
  "Christ Jesus, your name means salvation for all who call on you:" \
  "Lord Jesus, you hear your people through your Mother's prayers:"
```

Output: `Penitential Act_Solemnity of Mary Mother of God_C.docx`

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
