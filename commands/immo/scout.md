---
name: immo:scout
description: Research a location for investment viability (transport, Erbpacht, market)
allowed-tools:
  - Read
  - Bash
  - Write
  - Glob
  - Grep
  - WebSearch
  - WebFetch
  - Task
---

<objective>

Research a location for real estate investment, gathering critical data:
- Development details (name, developer, size)
- Erbpacht status (CRITICAL - auto-exclude if undisclosed)
- Public transport quality
- Parking necessity assessment
- Market conditions

**Creates:** `.immo/research/locations/[location].md`

**After this command:** Run `/immo:analyze [location]` to calculate metrics.

</objective>

<execution_context>

@~/.claude/immo/references/erbpacht-detection.md
@~/.claude/immo/references/transport-assessment.md
@~/.claude/immo/templates/location-research.md

</execution_context>

<process>

## Phase 1: Validation

**Check project exists:**
```bash
[ -f .immo/config.json ] || echo "NO_PROJECT"
```

If NO_PROJECT: "Run /immo:init first to create project."

**Parse location argument:**
Extract location name from command (e.g., "kassel" from "/immo:scout kassel")

**Check location folder:**
```bash
[ -d "properties/$LOCATION" ] && echo "EXISTS" || echo "NOT_FOUND"
```

If NOT_FOUND, ask user:
- "Location folder 'properties/[location]' not found. Create it?"
- If yes: `mkdir -p "properties/$LOCATION"`

## Phase 2: Document Discovery

**Scan for existing documents:**
```bash
find "properties/$LOCATION" -type f \( -name "*.pdf" -o -name "*.xlsx" -o -name "*.xls" \) 2>/dev/null
```

Note what's available:
- Price lists (Kaufpreisliste, Preisliste)
- Exposés/brochures
- Calculation examples (Berechnung)
- Floor plans

## Phase 3: Development Research

**Search for development information:**

Web searches:
- "[location] Neubau [current year]"
- "[development name if found in docs] [location]"
- "[developer name if found] [location] project"

**Extract:**
- Development name
- Developer/builder name
- Project size (number of units)
- Address
- Expected completion date
- Project concept (car-free, sustainable, etc.)

## Phase 4: Erbpacht Detection (CRITICAL)

**This is the most important check. Erbpacht with undisclosed costs = EXCLUDE.**

### 4.1 Document Search

Search documents for Erbpacht indicators:
```bash
grep -ri "erbpacht\|erbbaurecht\|erbbauzins" "properties/$LOCATION/" 2>/dev/null
```

### 4.2 Price List Analysis

If Excel price list available, check:
- Grundstücksanteil (land share) percentage
- If land share < 15% → ERBPACHT SUSPECTED

### 4.3 Web Search

Search for Erbpacht mentions:
- "[development name] [location] Erbpacht"
- "[development name] Erbbaurecht"
- "[developer name] ground lease"

### 4.4 Determination

**ERBPACHT STATUS:**
- `✅ NO ERBPACHT DETECTED` - No evidence found, proceed
- `⚠️ ERBPACHT SUSPECTED` - Indicators found, needs verification
- `🚨 ERBPACHT CONFIRMED` - Confirmed, check if costs disclosed

**If CONFIRMED:**
- Search for Erbbauzins (annual ground rent) amount
- Check remaining lease term
- If costs NOT disclosed → **RECOMMEND EXCLUSION**

## Phase 5: Transport Research

**Research public transport quality:**

Web searches:
- "[location] public transport network"
- "[location] tram bus S-Bahn"
- "[development name] location transport"
- "[location] ÖPNV"

**Extract:**
- Nearest public transport stop and distance
- Available lines (tram, bus, S-Bahn)
- Time to city center
- Network quality assessment (EXCELLENT/GOOD/MODERATE/POOR)

## Phase 6: Parking Assessment

**Based on transport quality + development concept:**

**If EXCELLENT transport AND development mentions:**
- "autofrei" (car-free)
- "autoarm" (car-reduced)
- "reduced traffic"
- "walkable"
- Urban location

→ **Parking: VALUABLE BUT NOT ESSENTIAL**

**If MODERATE/POOR transport OR:**
- Suburban location
- Family-oriented development
- Limited public transport

→ **Parking: ESSENTIAL**

## Phase 7: Market Research

**Research local market conditions:**

Web searches:
- "[location] housing market [current year]"
- "[location] Wohnungsmarkt"
- "[location] rental demand"
- "[location] property prices development"

**Extract:**
- Housing deficit/surplus
- Price trend
- Rental demand level
- Major employers/universities nearby

## Phase 8: Write Research File

Create `.immo/research/locations/[location].md`:

```markdown
# Location Research: [LOCATION]

**Researched:** [DATE]
**Status:** [ACTIVE | EXCLUDED]
**Exclusion Reason:** [if excluded]

---

## Development Overview

| Item | Details |
|------|---------|
| Name | [DEVELOPMENT_NAME] |
| Developer | [DEVELOPER] |
| Address | [ADDRESS] |
| Size | [NUM_UNITS] units |
| Completion | [DATE] |
| Concept | [CONCEPT] |

---

## Erbpacht Status

**Status:** [✅ NO ERBPACHT DETECTED | ⚠️ SUSPECTED | 🚨 CONFIRMED]

[Details and evidence]

**Evidence:**
- [Evidence 1]
- [Evidence 2]

**Action:** [PROCEED | VERIFY | EXCLUDE]

---

## Public Transport

| Item | Details |
|------|---------|
| Nearest Stop | [STOP_NAME] ([DISTANCE]) |
| Lines | [LINES] |
| City Center | [MINUTES] minutes |
| Network Quality | [EXCELLENT/GOOD/MODERATE/POOR] |

**Assessment:** [TRANSPORT_ASSESSMENT]

---

## Parking Necessity

**Verdict:** [ESSENTIAL | VALUABLE BUT NOT ESSENTIAL | OPTIONAL]

**Reasoning:**
[Reasoning based on transport + development concept]

---

## Market Conditions

| Metric | Value | Source |
|--------|-------|--------|
| Housing Deficit | [VALUE] | [SOURCE] |
| Price Trend | [TREND]%/year | [SOURCE] |
| Rental Demand | [HIGH/MODERATE/LOW] | [SOURCE] |

---

## Documents Found

| File | Type | Notes |
|------|------|-------|
[Document list from properties folder]

---

## Sources

[List of web sources with URLs]

---

## Recommendation

**Status:** [PROCEED | CAUTION | EXCLUDE]

[Recommendation text]
```

## Phase 9: Update STATE.md

Add location to STATE.md:
```markdown
| [location] | 🔍 SCOUTED | - | - | [STATUS] |
```

## Phase 10: Output Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 IMMO ► SCOUT: [LOCATION]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Development: [NAME]
   Developer: [DEVELOPER]
   Units: [COUNT]

⚠️ Erbpacht: [STATUS]
   [Details if relevant]

🚇 Transport: [QUALITY]
   Nearest: [STOP] ([DISTANCE])

🅿️ Parking: [VERDICT]

📊 Market: [SUMMARY]

✅ Research saved: .immo/research/locations/[location].md

📋 Next:
   [CONTEXTUAL - either analyze or exclude recommendation]
```

</process>

<erbpacht_rules>

## Erbpacht Detection Rules

### Document Indicators (HIGH confidence)
- Explicit "Erbpacht" or "Erbbaurecht" mention
- "Erbbauzins" (ground rent) mentioned
- Ground lease terms or expiration dates

### Price List Indicators (MEDIUM confidence)
- Grundstücksanteil < 15% of purchase price
- Separate "Gebäudeanteil" at >85%
- No land value in breakdown

### Web Indicators (MEDIUM confidence)
- Developer known for Erbpacht
- Location on church/municipal land
- Historical Erbpacht district

### Action Matrix

| Detection | Costs Disclosed | Action |
|-----------|-----------------|--------|
| Not detected | N/A | PROCEED |
| Suspected | N/A | VERIFY before proceeding |
| Confirmed | Yes, reasonable | PROCEED with caution |
| Confirmed | Yes, high | Calculate impact, likely EXCLUDE |
| Confirmed | No | **EXCLUDE** |

</erbpacht_rules>
