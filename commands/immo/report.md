---
name: immo:report
description: Generate professional financial advisor briefing from analysis
allowed-tools:
  - Read
  - Write
  - Glob
  - Bash
  - WebSearch
---

<objective>

Generate a comprehensive financial advisor briefing document:
1. Load all analysis data (config, research, shortlists)
2. Fill briefing template with calculated data
3. Translate if language specified
4. Save to output folder

**Creates:** `.immo/output/BRIEFING-[DATE].md`

**Usage:**
- `/immo:report` — Generate in English
- `/immo:report --lang pt` — Generate in Portuguese
- `/immo:report --lang de` — Generate in German

</objective>

<execution_context>

@~/.claude/immo/templates/briefing.md
@~/.claude/immo/references/methodology.md

</execution_context>

<process>

## Phase 1: Load All Data

**Load investor profile:**
Read `.immo/config.json`

**Load location research:**
Read all `.immo/research/locations/*.md`

**Load market research:**
Read `.immo/research/market/RATES-*.md` (latest)

**Load shortlists:**
Read all `.immo/analysis/*/SHORTLIST.md`

**Verify data completeness:**
- Config exists ✓
- At least one shortlist exists ✓
- Interest rate research exists (if not, fetch current rates)

## Phase 2: Compile Report Data

**From config.json:**
- Investor profile (income, tax rate, assets)
- Investment criteria
- Assumptions

**From research:**
- Location details
- Erbpacht status
- Transport assessment
- Parking verdict
- Excluded locations with reasons

**From shortlists:**
- All shortlisted units
- Full metrics for each
- Comparison data

**Calculate:**
- Summary statistics
- Winner by each metric
- Liquidity impact

## Phase 3: Interest Rate Section

**If rate research exists:**
Use data from `.immo/research/market/RATES-*.md`

**If no rate research:**
Perform quick web search for current rates:
- "Baufinanzierung Zinsen aktuell [year]"
- Extract top rate, typical range

**Compare with developer rate:**
Calculate difference and potential savings.

## Phase 4: Load Template

Read template from `~/.claude/immo/templates/briefing.md`

## Phase 5: Fill Template

Replace all `{{PLACEHOLDER}}` variables with actual data.

**Key sections to fill:**

### Executive Summary
```
{{INVESTMENT_DESCRIPTION}} → "Investment in 2-bedroom apartment in [LOCATION], Germany..."
{{UNITS_TABLE}} → Shortlist comparison table
{{GROSS_INCOME}} → From config
{{MARGINAL_TAX_RATE}} → From config
{{LIQUID_ASSETS}} → From config
{{CASHFLOW_Y1_4}} → Range from shortlist
{{CASHFLOW_Y5_10}} → Range from shortlist
{{PROFIT_RANGE}} → Range from shortlist
{{MAIN_CONCERNS}} → Interest rate, negative cashflow, appreciation risk
```

### Priority Questions
```
{{DEVELOPER_RATE}} → From analysis assumptions
{{MARKET_RATE}} → From rate research
{{INTEREST_SAVINGS}} → Calculated savings
{{TAX_BENEFIT_RANGE}} → From shortlist calculations
{{REMAINING_LIQUIDITY}} → Assets - Upfront costs
{{ANNUAL_OUTLAY_Y5_10}} → From shortlist
```

### Investor Profile
```
All fields from config.json
```

### Location Section
```
{{LOCATION}} → Location name
{{DEVELOPMENT_NAME}} → From research
{{DEVELOPMENT_TABLE}} → Details from research
{{TRANSPORT_TABLE}} → From research
{{PARKING_DESCRIPTION}} → From research
{{EXCLUSIONS_TABLE}} → Excluded locations with reasons
```

### Units Comparison
```
{{UNIT_HEADERS}} → Unit IDs
{{GENERAL_COMPARISON_TABLE}} → Full comparison
```

### Financing Section
```
{{INTEREST_RATE}} → From assumptions
{{MARKET_RATES_TABLE}} → From rate research
{{RATE_DIFFERENCE}} → Calculated
{{RATE_IMPACT_BY_UNIT}} → Savings per unit
```

### Cashflow Section
```
{{CASHFLOW_BY_UNIT}} → Detailed breakdown per unit
```

### Exit Analysis
```
{{EXIT_TABLE}} → 10-year projections
{{CASH_POSITION_BY_UNIT}} → Running totals
```

### Stress Tests
```
{{STRESS_0_APPRECIATION_TABLE}} → 0% scenario
{{STRESS_APPRECIATION_CONCLUSION}} → Analysis
{{STRESS_INTEREST_ANALYSIS}} → Rate hike impact
```

### Decision Framework
```
{{DECISION_FRAMEWORK_BY_UNIT}} → "Choose X if..." for each
{{PARKING_CONSIDERATION}} → From research
```

## Phase 6: Translation (if requested)

**If --lang specified:**

Translate the entire filled document to requested language:
- `pt` → Brazilian Portuguese
- `de` → German
- `es` → Spanish

**Translation notes:**
- Keep technical terms with German originals in parentheses
- Maintain table structure
- Preserve number formatting for target locale
- Keep emoji indicators

## Phase 7: Write Report

**Generate filename:**
`BRIEFING-[YYYY-MM-DD].md`

If file exists, append counter: `BRIEFING-[DATE]-2.md`

**Write to:**
`.immo/output/BRIEFING-[DATE].md`

## Phase 8: Update STATE.md

```markdown
### Phase: REPORTED
### Last Action: Generated advisor briefing
### Report: .immo/output/BRIEFING-[DATE].md
```

## Phase 9: Output Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 IMMO ► REPORT GENERATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Generated: .immo/output/BRIEFING-[DATE].md
🌐 Language: [LANGUAGE]

Contents:
  ✓ Executive Summary
  ✓ Priority Questions (10)
  ✓ Investor Profile
  ✓ Location Analysis
  ✓ [N] Units Compared
  ✓ Financing Analysis
  ✓ Interest Rate Comparison
  ✓ Cashflow Projections
  ✓ Tax Benefit Breakdown
  ✓ 10-Year Exit Analysis
  ✓ Risk Analysis
  ✓ Stress Tests
  ✓ Decision Framework
  ✓ Advisor Questions

📋 Next Steps:
  1. Review the report
  2. Share with your financial advisor
  3. Schedule consultation to discuss

  /immo:stress-test  For additional scenarios
```

</process>

<language_support>

## Supported Languages

| Code | Language | Notes |
|------|----------|-------|
| en | English | Default |
| pt | Brazilian Portuguese | Investor's advisor language |
| de | German | For German advisors |
| es | Spanish | Basic support |

## Translation Guidelines

**Keep original German terms:**
- AfA (Absetzung für Abnutzung)
- Sonder-AfA
- Nebenkosten
- Spekulationsfrist
- Tilgung
- Kaltmiete

**Provide translation in parentheses on first use:**
- "Sonder-AfA (depreciação especial)"
- "Nebenkosten (custos de aquisição)"

**Number formatting by locale:**
- English: €272,403
- Portuguese: €272.403
- German: 272.403 €

</language_support>
