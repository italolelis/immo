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
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 IMMO — Real Estate Investment Analysis System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

IMMO analyzes real estate investments systematically. It provides structured
workflows, consistent methodology, and professional reporting.

## Workflow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  INIT   │───▶│  SCOUT  │───▶│ ANALYZE │───▶│ FILTER  │───▶│ COMPARE │───▶│ REPORT  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │              │              │
  Profile       Research       Calculate       Apply        Side-by-side    Advisor
  + Setup       Location       Metrics       Criteria      Comparison      Briefing
```

## Quick Start

```bash
# 1. Initialize project with investor profile
/immo:init

# 2. Add property documents to properties/[location]/
#    (price lists, exposés, calculation docs)

# 3. Research the location
/immo:scout kassel

# 4. Analyze units and calculate metrics
/immo:analyze kassel

# 5. Apply criteria and create shortlist
/immo:filter kassel

# 6. Compare shortlisted properties
/immo:compare

# 7. Run stress tests (optional)
/immo:stress-test

# 8. Generate advisor briefing
/immo:report --lang pt
```

## Commands

### Setup & Status

| Command | Description |
|---------|-------------|
| `/immo:init` | Initialize project with investor profile |
| `/immo:status` | Show current state and next action |
| `/immo:update` | Update IMMO to the latest version |
| `/immo:help` | This reference |

### Research

| Command | Description |
|---------|-------------|
| `/immo:scout [location]` | Research location viability (Erbpacht, transport, market) |
| `/immo:rates` | Research current mortgage interest rates |

### Analysis

| Command | Description |
|---------|-------------|
| `/immo:analyze [location]` | Extract units, calculate metrics, rank by yield |
| `/immo:filter [location]` | Apply criteria and create shortlist |
| `/immo:compare` | Side-by-side comparison of all shortlisted units |
| `/immo:stress-test` | Run stress scenarios (0% appreciation, rate hike, vacancy) |

### Output

| Command | Description |
|---------|-------------|
| `/immo:report` | Full advisor briefing |
| `/immo:report --short` | 1-page executive summary |
| `/immo:report --lang pt` | Generate in Portuguese |
| `/immo:report --short --lang de` | Short summary in German |

## Command Details

### `/immo:init`

Initialize a new investment project through interactive flow.

**Gathers:**
- Country and tax class
- Income and marginal tax rate
- Liquid assets and commitments
- Investment horizon and financing preference
- Criteria (min yield, max price, size range, parking)

**Creates:**
- `.immo/config.json` — Investor profile
- `.immo/STATE.md` — Analysis state tracking
- `properties/` — Folder for property documents
- `IMMO.md` — Project summary

---

### `/immo:scout [location]`

Research a location for investment viability.

**Investigates:**
- Development details (name, developer, units, completion)
- **Erbpacht status** — CRITICAL, auto-excludes if undisclosed
- Public transport quality
- Parking necessity assessment
- Market conditions (rental demand, price trends)

**Creates:** `.immo/research/locations/[location].md`

**Example:** `/immo:scout kassel`

---

### `/immo:analyze [location]`

Analyze all properties in a location folder.

**Process:**
1. Extract units from price lists (Excel/PDF)
2. Calculate metrics (yield, price/m², upfront costs)
3. Model cashflow for Years 1-4 (with Sonder-AfA) and Years 5-10
4. Project 10-year exit value and ROE

**Creates:**
- `.immo/analysis/[location]/UNITS.md` — All extracted units
- `.immo/analysis/[location]/RANKED.md` — Sorted by metrics

**Example:** `/immo:analyze kassel`

---

### `/immo:filter [location]`

Apply investor's criteria to create shortlist.

**Filters:**
- Minimum yield
- Maximum price
- Size range
- Parking requirement
- Floor exclusions

**Creates:**
- `.immo/analysis/[location]/SHORTLIST.md` — Qualifying units
- `.immo/analysis/[location]/EXCLUSIONS.md` — Excluded with reasons

**Example:** `/immo:filter kassel`

---

### `/immo:compare`

Side-by-side comparison of all shortlisted properties.

**Displays:**
- Unified comparison table (price, yield, cashflow, profit)
- Winners by metric
- Liquidity impact
- Decision framework ("Choose X if...")

---

### `/immo:stress-test`

Run stress scenarios on shortlisted properties.

**Scenarios:**
1. **Zero appreciation** — Property values stay flat
2. **Rate hike** — +2% interest at refinancing
3. **Extended vacancy** — 3 months every 2 years
4. **Combined worst case** — All factors together

**Creates:** `.immo/analysis/STRESS-TEST.md`

---

### `/immo:rates`

Research current mortgage interest rates in Germany.

**Sources:** Dr. Klein, Baufi24, Interhyp, Finanztip

**Outputs:**
- Current top rates by fixed period
- Comparison with developer rates
- Potential savings calculation

**Creates:** `.immo/research/market/RATES-[date].md`

---

### `/immo:report [--short] [--lang XX]`

Generate advisor briefing document.

**Full Report (default):**
- Executive summary, investor profile, location analysis
- Units comparison, cashflow projections, tax benefits
- 10-year exit analysis, stress tests, decision framework
- Creates: `.immo/output/BRIEFING-[date].md`

**Short Report (`--short`):**
- 1-page executive summary
- Top 5 units comparison table
- Recommendation with reasoning
- Key risks and mitigations
- 5 questions for your advisor
- Creates: `.immo/output/SUMMARY-[date].md`

**Languages:** `en` (default), `pt` (Portuguese), `de` (German)

**Examples:**
- `/immo:report` — Full briefing
- `/immo:report --short` — 1-page summary
- `/immo:report --short --lang pt` — Short summary in Portuguese

---

### `/immo:status`

Show current analysis state and recommended next action.

**Displays:**
- Current workflow phase
- Investor profile summary
- Locations and their status
- Shortlisted properties
- Next recommended action

## Key Concepts

### Erbpacht (Ground Lease)

Ground lease where you own the building but lease the land. IMMO auto-detects
Erbpacht indicators and **excludes properties with undisclosed ground rent**.

**Why critical:** Hidden Erbbauzins (ground rent) can cost €1,000-5,000/year.

### Sonder-AfA §7b

German special depreciation for new construction:
- **Years 1-4:** 5% special + 2% regular = 7% annual depreciation
- **Years 5-10:** 2% regular depreciation only

IMMO models both phases separately — the "good period" and the "bleeding period".

### Spekulationsfrist

German 10-year holding period for tax-free capital gains. IMMO's default
strategy: buy → rent → sell tax-free at year 10.

### Nebenkosten

German acquisition costs (~8% of purchase price):
- Grunderwerbsteuer (transfer tax): 3.5-6.5% by state
- Notary fees: ~1.5%
- Land registry: ~0.5%

## File Structure

```
project/
├── IMMO.md                    # Project summary
├── properties/
│   └── [location]/            # Property documents (price lists, exposés)
│
└── .immo/
    ├── config.json            # Investor profile and criteria
    ├── STATE.md               # Workflow state tracking
    │
    ├── research/
    │   ├── market/
    │   │   └── RATES-*.md     # Interest rate research
    │   └── locations/
    │       └── [location].md  # Location research
    │
    ├── analysis/
    │   ├── [location]/
    │   │   ├── UNITS.md       # All extracted units
    │   │   ├── RANKED.md      # Sorted by metrics
    │   │   ├── SHORTLIST.md   # Qualifying units
    │   │   └── EXCLUSIONS.md  # Excluded with reasons
    │   └── STRESS-TEST.md     # Stress test results
    │
    └── output/
        └── BRIEFING-*.md      # Generated reports
```

## Supported Countries

| Country | Status | Key Features |
|---------|--------|--------------|
| Germany | **Full** | Sonder-AfA, Spekulationsfrist, Nebenkosten, Erbpacht detection |
| Portugal | Planned | Golden Visa, NHR regime |
| Spain | Planned | — |
| Netherlands | Planned | — |

## Core Methodology

IMMO follows 10 mandatory rules:

1. **Independent Calculation** — Never trust developer marketing numbers
2. **Erbpacht First** — Always verify ground lease status
3. **Correct Tax Rate** — Use investor's actual marginal rate
4. **Two-Phase Cashflow** — Show Y1-4 and Y5-10 separately
5. **All Costs Included** — Nebenkosten, construction interest, management
6. **Conservative Assumptions** — 2% appreciation, 0% rent increase
7. **Stress Testing** — 0% appreciation, rate hikes, vacancy
8. **Parking Research** — Assess transport for each location
9. **Interest Rate Verification** — Compare to market rates
10. **Decision Framework** — Present trade-offs, let investor decide

## Updating IMMO

```bash
/immo:update
```

Or manually:
```bash
npx immo-cc@latest
```

## Getting Help

| Resource | Description |
|----------|-------------|
| `/immo:help` | This reference |
| `/immo:status` | Current state and next action |
| [GitHub Issues](https://github.com/italolelis/immo/issues) | Bug reports and feature requests |

</reference>
