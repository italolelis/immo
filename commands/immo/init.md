---
name: immo:init
description: Initialize a new investment project with investor profile gathering
allowed-tools:
  - Read
  - Bash
  - Write
  - AskUserQuestion
---

<objective>

Initialize a new real estate investment analysis project through interactive flow: profile gathering → criteria setting → project setup.

This is the foundation of any analysis. Deep profile gathering here means accurate tax calculations, appropriate property filtering, and realistic projections.

**Creates:**
- `.immo/config.json` — investor profile and preferences
- `.immo/STATE.md` — analysis state tracking
- `properties/` — folder for property documents
- `IMMO.md` — project summary

**After this command:** Add property folders to `properties/`, then run `/immo:scout [location]`.

</objective>

<execution_context>

@~/.claude/immo/references/germany/tax-rules.md
@~/.claude/immo/templates/config.json
@~/.claude/immo/templates/state.md

</execution_context>

<process>

## Phase 1: Setup Check

**MANDATORY FIRST STEP — Execute before ANY user interaction:**

1. **Abort if project exists:**
   ```bash
   [ -f .immo/config.json ] && echo "ERROR: Project already initialized. Use /immo:status" && exit 1
   ```

2. **Check for existing properties folder:**
   ```bash
   [ -d properties ] && echo "Properties folder exists" || echo "No properties folder"
   ```

**You MUST run these checks using the Bash tool before proceeding.**

## Phase 2: Country Selection

**Display stage banner:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 IMMO ► PROJECT SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Use AskUserQuestion:
- header: "Country"
- question: "Which country are you investing in?"
- options:
  - "Germany" — Full support (Sonder-AfA, Spekulationsfrist, Nebenkosten)
  - "Portugal" — Coming soon
  - "Spain" — Coming soon
  - "Other" — Basic analysis only

**If not Germany:** Inform user that country-specific tax rules are not yet implemented, but basic analysis is available. Continue with generic settings.

## Phase 3: Investor Profile (Germany)

**For Germany, gather tax-relevant information:**

### 3.1 Tax Class

Use AskUserQuestion:
- header: "Tax Class"
- question: "What is your German tax class?"
- options:
  - "I (Single)" — Standard single taxation
  - "III/V (Married, one high earner)" — Combined assessment, one primary earner (Recommended for high earners)
  - "IV/IV (Married, equal earners)" — Combined assessment, equal incomes

### 3.2 Church Tax

Use AskUserQuestion:
- header: "Church Tax"
- question: "Are you a church tax member (Kirchensteuer)?"
- options:
  - "No" — No church tax deduction (Recommended - higher net benefit)
  - "Yes" — 8-9% additional on income tax

### 3.3 Income

Ask inline (freeform):
"What is your annual gross income? If married, please provide both incomes."

Parse response to extract:
- Primary earner income
- Spouse income (if provided)
- Total household income

### 3.4 Calculate Marginal Tax Rate

Based on gathered information, calculate:

**For Germany:**
```
If total income > €277,826 (married) or €68,480 (single):
  baseRate = 42%
else:
  baseRate = progressive (use tax tables)

marginalRate = baseRate + (baseRate × 5.5%)  # Solidaritätszuschlag

If churchTax:
  marginalRate += baseRate × 8%  # Bavaria/Baden-Württemberg: 8%, others: 9%
```

Display calculated rate to user for confirmation.

### 3.5 Liquid Assets

Ask inline:
"What are your total liquid assets available for investment? (Include savings, investments that could be liquidated)"

### 3.6 Monthly Commitments

Ask inline:
"What are your existing monthly financial commitments? (Pension contributions, other investments, etc.)"

## Phase 4: Investment Strategy

### 4.1 Horizon

Use AskUserQuestion:
- header: "Horizon"
- question: "What is your investment horizon?"
- options:
  - "10 years (tax-free sale)" — Standard Spekulationsfrist strategy (Recommended)
  - "15+ years (long-term hold)" — Build equity, potential refinancing
  - "5-7 years (shorter term)" — Note: capital gains tax applies

### 4.2 Financing

Use AskUserQuestion:
- header: "Financing"
- question: "What financing approach do you prefer?"
- options:
  - "100% financing" — Maximum leverage, all acquisition costs from savings (Recommended for tax optimization)
  - "90% financing" — 10% down payment for better rates
  - "80% financing" — 20% down payment for best rates

## Phase 5: Investment Criteria

### 5.1 Property Type

Use AskUserQuestion:
- header: "Type"
- question: "What type of property are you looking for?"
- options:
  - "2-bedroom apartment" — Most liquid, broad tenant pool (Recommended)
  - "1-bedroom apartment" — Lower price, limited tenants
  - "3-bedroom apartment" — Family tenants, higher price
  - "Any" — No restriction

### 5.2 Yield & Price

Ask inline:
"What are your investment criteria?
- Minimum acceptable gross yield (e.g., 2.8%):
- Maximum property price (e.g., €450,000):
- Size range in m² (e.g., 45-80):"

Parse response to extract criteria.

### 5.3 Parking

Use AskUserQuestion:
- header: "Parking"
- question: "Is parking required?"
- options:
  - "Not required" — Higher yield options available (Recommended - IMMO researches transport for each location)
  - "Required" — Limits options, adds ~€25k to price
  - "Preferred" — Consider both, prioritize with parking

### 5.4 Other Preferences

Use AskUserQuestion (multiSelect: true):
- header: "Preferences"
- question: "Any other preferences? (Select all that apply)"
- options:
  - "Exclude ground floor" — Less desirable for some tenants
  - "Top floor preferred" — Premium units
  - "New construction only" — Sonder-AfA eligible
  - "No Erbpacht" — Exclude ground lease properties (Recommended)

## Phase 6: Create Project Files

### 6.1 Create Directory Structure

```bash
mkdir -p .immo/research/market
mkdir -p .immo/research/locations
mkdir -p .immo/analysis
mkdir -p .immo/output
mkdir -p properties
```

### 6.2 Write config.json

Create `.immo/config.json` with all gathered data:

```json
{
  "$schema": "https://immo.dev/schemas/config.schema.json",
  "version": "1.0.0",
  "created": "[ISO_DATE]",
  "updated": "[ISO_DATE]",

  "project": {
    "name": "[PROJECT_NAME based on date or user input]",
    "propertiesFolder": "properties",
    "outputFolder": ".immo/output",
    "language": "en"
  },

  "investor": {
    "country": "[COUNTRY]",
    "taxClass": "[TAX_CLASS]",
    "churchTax": [true/false],
    "children": [NUMBER],
    "income": {
      "primary": [PRIMARY_INCOME],
      "spouse": [SPOUSE_INCOME],
      "total": [TOTAL_INCOME]
    },
    "marginalRate": [CALCULATED_RATE],
    "liquidAssets": [LIQUID_ASSETS],
    "monthlyCommitments": [MONTHLY_COMMITMENTS]
  },

  "strategy": {
    "type": "neubau-rent-sell",
    "horizon": [HORIZON],
    "financing": {
      "ltv": [LTV_PERCENT],
      "fixedPeriod": 10
    },
    "management": "professional",
    "exitPlan": "sell-tax-free"
  },

  "criteria": {
    "propertyType": "[TYPE]",
    "bedrooms": [BEDROOMS_ARRAY],
    "minYield": [MIN_YIELD],
    "maxPrice": [MAX_PRICE],
    "minSize": [MIN_SIZE],
    "maxSize": [MAX_SIZE],
    "parkingRequired": [true/false],
    "parkingPreferred": [true/false],
    "excludeErbpacht": [true/false],
    "excludeGroundFloor": [true/false],
    "topFloorPreferred": [true/false],
    "newConstructionOnly": [true/false]
  },

  "assumptions": {
    "appreciation": 2.0,
    "rentIncrease": 0,
    "vacancy": 0,
    "verwaltungPerSqm": 1.0,
    "rucklagePerSqm": 0.6,
    "saleCosts": 7.0,
    "constructionPeriod": 18,
    "constructionDraw": 50
  }
}
```

### 6.3 Write STATE.md

Create `.immo/STATE.md`:

```markdown
# IMMO Analysis State

## Project: [PROJECT_NAME]
## Phase: INIT
## Created: [ISO_DATE]
## Updated: [ISO_DATE]

---

### Investor Profile

| Item | Value |
|------|-------|
| Country | [COUNTRY] |
| Marginal Tax Rate | [RATE]% |
| Liquid Assets | €[ASSETS] |
| Monthly Commitments | €[COMMITMENTS] |
| Investment Horizon | [HORIZON] years |

### Criteria

| Item | Value |
|------|-------|
| Min Yield | [MIN_YIELD]% |
| Max Price | €[MAX_PRICE] |
| Size Range | [MIN]-[MAX] m² |
| Parking Required | [YES/NO] |

---

### Locations

No locations added yet. Add property folders to `properties/` then run:
```
/immo:scout [location-name]
```

---

### Shortlist

No properties shortlisted yet.

---

### History

- [ISO_DATE]: Project initialized
```

### 6.4 Write IMMO.md

Create `IMMO.md` in project root:

```markdown
# [PROJECT_NAME]

Real estate investment analysis project.

## Quick Status

Run `/immo:status` for current state.

## Investor Profile

- **Income:** €[TOTAL_INCOME]/year
- **Tax Rate:** [RATE]%
- **Available:** €[LIQUID_ASSETS]
- **Horizon:** [HORIZON] years

## Criteria

- Yield: ≥[MIN_YIELD]%
- Price: ≤€[MAX_PRICE]
- Size: [MIN]-[MAX] m²

## Getting Started

1. Add property documents to `properties/[location]/`
2. Run `/immo:scout [location]` to research
3. Run `/immo:analyze [location]` to analyze
4. Run `/immo:compare` to compare shortlist
5. Run `/immo:report` to generate briefing

---

*Managed by IMMO - Real Estate Investment Analysis System*
```

## Phase 7: Completion

**Display summary:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 IMMO ► PROJECT INITIALIZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Created:
   .immo/config.json      Investor profile
   .immo/STATE.md         Analysis state
   .immo/research/        Location research
   .immo/analysis/        Property analysis
   .immo/output/          Generated reports
   properties/            Add your property docs here
   IMMO.md               Project summary

📊 Your Profile:
   Income:     €[TOTAL_INCOME]/year
   Tax Rate:   [RATE]%
   Available:  €[LIQUID_ASSETS]
   Horizon:    [HORIZON] years

🎯 Criteria:
   Min Yield:  [MIN_YIELD]%
   Max Price:  €[MAX_PRICE]
   Size:       [MIN]-[MAX] m²

📋 Next Steps:
   1. Add property folders to properties/
      (price lists, exposés, calculation docs)
   2. Run /immo:scout [location] to research
```

</process>

<error_handling>

- **Project exists:** "Project already initialized. Use `/immo:status` to see current state or delete `.immo/` to start fresh."
- **Invalid income:** Prompt for clarification with examples
- **Country not supported:** Inform user, offer basic analysis without country-specific tax rules
- **Parse errors:** Ask user to rephrase in clearer format

</error_handling>
