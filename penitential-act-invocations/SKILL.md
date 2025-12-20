---
name: penitential-act-invocations
description: Writes three invocations for the Penitential Act (Form C) based on the day's liturgical readings. Use when a deacon or liturgy preparer needs to compose invocations for Mass. Fetches readings from USCCB, identifies themes, confirms with user, then drafts short, Christologically-focused invocations. Can hand off to penitential-act skill for formatting.
---

# Penitential Act Invocation Writer

Compose three invocations for the Penitential Act (Form C with tropes) based on the day's Scripture readings.

## Workflow

### 1. Resolve the Liturgical Date

User provides a date reference: "Fourth Sunday of Advent", "this Sunday", "December 22", "Solemnity of Mary", etc.

**To resolve:**
1. Fetch the USCCB liturgical calendar PDF for the relevant year(s):
   - 2025: `https://www.usccb.org/resources/2025cal.pdf`
   - 2026: `https://www.usccb.org/resources/2026cal.pdf`
   - Pattern: `https://www.usccb.org/resources/{YEAR}cal.pdf`
2. Search the calendar to find the date for the named celebration
3. Extract: celebration name, date, liturgical year (A/B/C), season

**If ambiguous** (e.g., "this Sunday" could mean last or next), ask user to clarify before proceeding.

**Always confirm** the resolved date with user: "December 22, 2024 is the Fourth Sunday of Advent, Year C. Shall I proceed?"

### 2. Fetch the Readings

Retrieve readings from USCCB:
```
https://bible.usccb.org/bible/readings/MMDDYY.cfm
```

Extract:
- **Gospel** (primary source for themes)
- **First Reading** (secondary source)
- **Second Reading** (reference as appropriate)
- **Responsorial Psalm** (reference as appropriate)

### 3. Identify and Confirm Themes

Present 4-6 key themes from the readings to the user:

> Based on the readings for [Celebration Name] ([Date], Year [X]):
> - [Theme 1 from Gospel]
> - [Theme 2 from Gospel]  
> - [Theme 3 from First Reading]
> - [Theme 4 - additional]
> - [Theme 5 - from Psalm or Second Reading if notable]
>
> Which themes would you like me to emphasize in the invocations?

Wait for user selection before drafting.

### 4. Draft Invocations

Write exactly **three invocations** following these rules:

**Length and Structure:**
- Each invocation must be ONE sentence only
- Keep invocations short and direct
- End each invocation with a colon

**Christological Focus:**
- Prefer traditional Christological titles while incorporating day's themes
- Address Christ directly using "you" statements

**Consistency Rule - IMPORTANT:**
- If one invocation starts with "Lord Jesus" or "Christ Jesus", ALL THREE must follow the pattern:
  - Invocation 1: "Lord Jesus, [invocation]:"
  - Invocation 2: "Christ Jesus, [invocation]:"
  - Invocation 3: "Lord Jesus, [invocation]:"
- Alternative: invocations may omit the title prefix entirely, starting directly with "You..." — but be consistent

**Output Format:**
```
Lord Jesus, [short invocation based on themes]:
Lord, have mercy.

Christ Jesus, [short invocation based on themes]:
Christ, have mercy.

Lord Jesus, [short invocation based on themes]:
Lord, have mercy.
```

### 5. User Review

Present the draft and ask: "Would you like any adjustments to these invocations?"

Iterate as needed until user approves.

### 6. Handoff to Formatting

When user indicates they're ready to publish/format, invoke the `penitential-act-formatter` skill with:

- **celebration**: The celebration name (e.g., "4th Sunday of Advent" or "Solemnity of Mary, Mother of God")
- **season**: Liturgical season (Advent, Christmas, Lent, Easter, Ordinary Time)
- **year**: A, B, or C
- **invocations**: The three invocation texts (without "Lord/Christ, have mercy" responses)

## Examples

### Example 1: Fourth Sunday of Advent, Year C

**Themes selected:** Christ's presence bringing joy, Mary's faith, Christ as shepherd

**Output:**
```
Lord Jesus, you are the shepherd promised from Bethlehem:
Lord, have mercy.

Christ Jesus, your hidden presence stirs joy in faithful hearts:
Christ, have mercy.

Lord Jesus, you bless all who believe your promises:
Lord, have mercy.
```

### Example 2: Second Sunday of Ordinary Time, Year C (Cana)

**Themes selected:** Wedding at Cana, transformation, God's delight

**Output:**
```
You revealed your glory and your disciples began to believe:
Lord, have mercy.

You transform our emptiness into abundant grace:
Christ, have mercy.

You delight in your people as a bridegroom in his bride:
Lord, have mercy.
```

### Example 3: Solemnity of Mary, Mother of God

**Themes selected:** Mary as Mother, adoption as children, name of Jesus

**Output:**
```
Lord Jesus, born of the Virgin Mary to make us children of God:
Lord, have mercy.

Christ Jesus, your name means salvation for all who call on you:
Christ, have mercy.

Lord Jesus, you hear your people through your Mother's prayers:
Lord, have mercy.
```
