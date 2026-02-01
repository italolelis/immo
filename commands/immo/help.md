---
name: immo:help
description: Show available IMMO commands and usage guide
---

<objective>
Display the complete IMMO command reference.

Output ONLY the reference content below. Do NOT add:
- Project-specific analysis
- File context
- Next-step suggestions beyond what's in the reference
</objective>

<reference>
# IMMO Command Reference

**IMMO** analyzes real estate investments systematically. It provides structured workflows, consistent methodology, and professional reporting.

## Quick Start

1. `/immo:init` - Initialize project with investor profile
2. Add property documents to `properties/[location]/`
3. `/immo:scout [location]` - Research locations
4. `/immo:analyze [location]` - Calculate metrics
5. `/immo:compare` - Compare shortlist
6. `/immo:report` - Generate advisor briefing

## Staying Updated

```bash
npx immo-cc@latest
```

## Core Workflow

```
/immo:init → /immo:scout → /immo:analyze → /immo:compare → /immo:report
```

### Project Initialization

**`/immo:init`**
Initialize new investment project through interactive flow.

One command sets up your analysis environment:
- Investor profile (income, tax class, assets)
- Investment criteria (yield, price, size)
- Country-specific settings (Germany, Portugal, etc.)

Creates all `.immo/` artifacts:
- `config.json` — investor profile and preferences
- `STATE.md` — analysis state tracking
- `research/` — location research
- `analysis/` — property analysis
- `output/` — generated reports

Usage: `/immo:init`

**`/immo:status`**
Show current analysis state and recommended next action.

Displays:
- Current workflow phase
- Locations and their status
- Shortlisted properties
- Pending actions

Usage: `/immo:status`

### Research Phase

**`/immo:scout [location]`**
Research a location for investment viability.

Investigates:
- Development details (name, developer, size)
- Erbpacht status (CRITICAL - auto-excludes if undisclosed)
- Public transport quality
- Parking necessity assessment
- Market conditions

Creates: `.immo/research/locations/[location].md`

Usage: `/immo:scout kassel`

**`/immo:rates`**
Research current mortgage interest rates.

Sources: Dr. Klein, Baufi24, Interhyp, Finanztip

Outputs:
- Current top rates by fixed period
- Rate forecast
- Comparison with developer rates

Creates: `.immo/research/market/RATES-[date].md`

Usage: `/immo:rates`

**`/immo:add-location [name]`**
Add a new location folder for analysis.

Creates: `properties/[name]/`

Usage: `/immo:add-location munich`

### Analysis Phase

**`/immo:analyze [location]`**
Analyze all properties in a location.

Process:
1. Extract units from price lists (Excel/PDF)
2. Calculate metrics (yield, price/m², cashflow)
3. Apply investor's tax rate
4. Rank by real metrics (not brochure IRR)

Creates:
- `.immo/analysis/[location]/UNITS.md`
- `.immo/analysis/[location]/RANKED.md`

Usage: `/immo:analyze kassel`

**`/immo:analyze-all`**
Analyze all locations in properties folder.

Usage: `/immo:analyze-all`

**`/immo:extract [file]`**
Extract units from a specific price list file.

Supports: Excel (.xlsx), PDF price lists

Usage: `/immo:extract "properties/kassel/Kaufpreisliste.xlsx"`

### Filter & Compare Phase

**`/immo:filter [location]`**
Apply exclusion rules and create shortlist.

Applies:
- Criteria from config (min yield, max price, size range)
- Quality exclusions (if marked)
- Erbpacht exclusions

Creates: `.immo/analysis/[location]/SHORTLIST.md`

Usage: `/immo:filter kassel`

**`/immo:exclude [unit] [reason]`**
Manually exclude a unit with documented reason.

Reasons: quality, erbpacht, price, yield, location, other

Usage: `/immo:exclude "kassel/3.7" "ground floor not preferred"`

**`/immo:compare`**
Side-by-side comparison of shortlisted units.

Displays:
- All metrics in comparison table
- Cashflow by phase (Y1-4, Y5-10)
- 10-year profit and ROE
- Decision framework

Usage: `/immo:compare`

**`/immo:stress-test`**
Run stress scenarios on shortlisted properties.

Scenarios:
- 0% appreciation (no property value growth)
- Higher refinancing rate (5% at year 10)
- Extended vacancy (2 months/year)

Usage: `/immo:stress-test`

### Report Phase

**`/immo:report [--lang XX]`**
Generate professional advisor briefing.

Uses template with:
- Executive summary
- Priority questions for advisor
- Full financial analysis
- Comparison tables
- Risk analysis
- Decision framework

Languages: `en` (default), `pt` (Portuguese), `de` (German)

Creates: `.immo/output/BRIEFING-[date].md`

Usage: `/immo:report --lang pt`

**`/immo:summary`**
Quick summary of current shortlist.

Displays compact table without full report.

Usage: `/immo:summary`

### Settings

**`/immo:set [key] [value]`**
Update configuration value.

Examples:
- `/immo:set minYield 3.0`
- `/immo:set maxPrice 400000`
- `/immo:set language pt`

Usage: `/immo:set [key] [value]`

**`/immo:profile`**
View or edit investor profile.

Usage: `/immo:profile`

**`/immo:reset [location]`**
Reset analysis for a location (keeps documents).

Usage: `/immo:reset kassel`

## Supported Countries

| Country | Status | Key Features |
|---------|--------|--------------|
| 🇩🇪 Germany | Full | Sonder-AfA, Spekulationsfrist, Nebenkosten |
| 🇵🇹 Portugal | Planned | Golden Visa, NHR regime |
| 🇪🇸 Spain | Planned | - |
| 🇳🇱 Netherlands | Planned | - |

## Key Concepts

### Erbpacht (Ground Lease)
IMMO auto-detects Erbpacht indicators and excludes properties with undisclosed ground rent costs. This is critical as Erbpacht significantly impacts returns.

### Sonder-AfA §7b
German special depreciation (5%/year for 4 years) for new construction. IMMO models this in Years 1-4, then regular AfA (2%) for Years 5-10.

### Spekulationsfrist
German 10-year holding period for tax-free capital gains. IMMO's default strategy is buy → rent → sell tax-free at year 10.

### Nebenkosten
German acquisition costs (~8%): transfer tax + notary + registration. IMMO calculates by state (rates vary 3.5%-6.5% for transfer tax).

## Files Reference

```
.immo/
├── config.json         # Investor profile
├── STATE.md            # Workflow state
├── research/
│   ├── market/         # Rate research
│   └── locations/      # Location research
├── analysis/
│   └── [location]/
│       ├── UNITS.md    # All units
│       ├── RANKED.md   # Sorted by metrics
│       └── SHORTLIST.md
└── output/
    └── BRIEFING-*.md   # Generated reports
```

## Getting Help

- `/immo:help` - This reference
- `/immo:status` - Current state and next action
- GitHub Issues - Bug reports and feature requests

</reference>
