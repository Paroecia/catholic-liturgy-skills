---
name: penitential-act-invocations
description: Writes the complete Penitential Act (Form C) including priest's introduction, three invocations, and absolution prayer based on the day's liturgical readings. Use when a deacon or liturgy preparer needs to compose the Penitential Act for Mass. Fetches readings from USCCB, identifies themes, confirms with user, then drafts priest's introduction, short Christologically-focused invocations, and absolution prayer. Can hand off to penitential-act skill for formatting.
---

# Penitential Act Writer

Compose the complete Penitential Act (Form C with tropes) based on the day's Scripture readings, including the priest's introduction, three invocations, and absolution prayer.

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

### 4. Draft the Complete Penitential Act

Write the complete Penitential Act in this order:

#### A. Priest's Introduction

Compose an introduction where the priest invites the assembly to acknowledge their sins.

**Guidelines:**
- Can be standard text or adapted to the day's themes
- Should help the assembly call to mind their sins
- Can be a bit longer than the invocations (2-3 sentences)
- Use inclusive language ("us", "our") to invite the community
- Gentle and inviting tone, not harsh or condemning

**Standard option:**
```
Brethren (brothers and sisters), let us acknowledge our sins, and so prepare ourselves to celebrate the sacred mysteries.
```

**Theme-adapted option example:**
```
As we prepare to celebrate these sacred mysteries, let us pause to acknowledge the times we have turned away from God's light, failed to trust in his promises, or neglected to share his love with others.
```

#### B. Three Invocations

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

#### C. Absolution Prayer

Include the standard absolution prayer that the priest prays after the Penitential Act:

```
May almighty God have mercy on us, forgive us our sins, and bring us to everlasting life.
```

**Complete output format:**
```
[Priest's introduction]

Lord Jesus, [invocation]:
Lord, have mercy.

Christ Jesus, [invocation]:
Christ, have mercy.

Lord Jesus, [invocation]:
Lord, have mercy.

May almighty God have mercy on us, forgive us our sins, and bring us to everlasting life.
```

### 5. User Review

Present the complete draft and ask: "Would you like any adjustments to the introduction, invocations, or absolution prayer?"

Iterate as needed until user approves.

### 6. Handoff to Formatting

When user indicates they're ready to publish/format, invoke the `penitential-act` skill with:

- **celebration**: The celebration name (e.g., "4th Sunday of Advent" or "Solemnity of Mary, Mother of God")
- **season**: Liturgical season (Advent, Christmas, Lent, Easter, Ordinary Time)
- **year**: A, B, or C
- **introduction**: The priest's introduction text
- **invocations**: The three invocation texts (without "Lord/Christ, have mercy" responses)
- **absolution**: The absolution prayer text

## Examples

### Example 1: Fourth Sunday of Advent, Year C

**Themes selected:** Christ's presence bringing joy, Mary's faith, Christ as shepherd

**Output:**
```
As we prepare to celebrate these sacred mysteries on this final Sunday of Advent, let us acknowledge the times we have failed to recognize God's presence among us, doubted his promises, or closed our hearts to his joy.

Lord Jesus, you are the shepherd promised from Bethlehem:
Lord, have mercy.

Christ Jesus, your hidden presence stirs joy in faithful hearts:
Christ, have mercy.

Lord Jesus, you bless all who believe your promises:
Lord, have mercy.

May almighty God have mercy on us, forgive us our sins, and bring us to everlasting life.
```

### Example 2: Second Sunday of Ordinary Time, Year C (Cana)

**Themes selected:** Wedding at Cana, transformation, God's delight

**Output:**
```
Brethren, let us acknowledge our sins, and so prepare ourselves to celebrate the sacred mysteries.

You revealed your glory and your disciples began to believe:
Lord, have mercy.

You transform our emptiness into abundant grace:
Christ, have mercy.

You delight in your people as a bridegroom in his bride:
Lord, have mercy.

May almighty God have mercy on us, forgive us our sins, and bring us to everlasting life.
```

### Example 3: Solemnity of Mary, Mother of God

**Themes selected:** Mary as Mother, adoption as children, name of Jesus

**Output:**
```
As we begin this new year under the protection of Mary, Mother of God, let us acknowledge our sins and ask for her intercession as we seek God's mercy.

Lord Jesus, born of the Virgin Mary to make us children of God:
Lord, have mercy.

Christ Jesus, your name means salvation for all who call on you:
Christ, have mercy.

Lord Jesus, you hear your people through your Mother's prayers:
Lord, have mercy.

May almighty God have mercy on us, forgive us our sins, and bring us to everlasting life.
```