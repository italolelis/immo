# IMMO

A meta-prompting and context engineering system for **real estate investment analysis** with Claude Code.

IMMO brings the same systematic approach that [GSD](https://github.com/glittercowboy/get-shit-done) brings to software development — but for analyzing real estate investments.

```
/immo:init          # Initialize project with investor profile
/immo:scout kassel  # Research a location
/immo:analyze       # Analyze all properties
/immo:compare       # Compare shortlisted units
/immo:report        # Generate advisor briefing
```

## Why IMMO?

Real estate investment analysis is complex:
- Multiple locations, dozens of units to compare
- Country-specific tax rules (Sonder-AfA, Spekulationsfrist, Nebenkosten...)
- Financing calculations with construction phase interest
- Cashflow projections across 10+ year horizons
- Stress testing for various scenarios

IMMO provides:
- **Consistent methodology** - 18+ rules applied to every property
- **Tax-aware calculations** - Country-specific benefits modeled correctly
- **Structured workflow** - From research to advisor-ready reports
- **Context management** - No more losing track across analysis sessions

## Installation

```bash
# Install globally (recommended)
npx immo-cc --global

# Or install to current project only
npx immo-cc --local
```

## Quick Start

```bash
# 1. Initialize your investor profile
/immo:init

# 2. Add property documents to properties/[location]/
#    (price lists, exposés, calculation examples)

# 3. Research locations
/immo:scout kassel
/immo:scout munich

# 4. Analyze properties
/immo:analyze kassel

# 5. Compare shortlist
/immo:compare

# 6. Generate advisor briefing
/immo:report --lang pt
```

## Workflow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   INIT   │───▶│  SCOUT   │───▶│ ANALYZE  │───▶│  FILTER  │
│          │    │          │    │          │    │          │
│ Profile  │    │ Research │    │ Calculate│    │ Exclude  │
│ Goals    │    │ Locations│    │ Metrics  │    │ Shortlist│
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                      │
┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  DECIDE  │◀───│  REPORT  │◀───│ COMPARE  │◀────────┘
│          │    │          │    │          │
│ Framework│    │ Generate │    │ Side-by  │
│ Support  │    │ Briefing │    │ Side     │
└──────────┘    └──────────┘    └──────────┘
```

## Project Structure

When you run `/immo:init`, IMMO creates:

```
your-project/
├── .immo/                      # IMMO system folder
│   ├── config.json             # Investor profile + preferences
│   ├── STATE.md                # Current workflow state
│   ├── research/
│   │   ├── market/             # Interest rate research
│   │   └── locations/          # Per-location research
│   ├── analysis/
│   │   └── [location]/         # Per-location analysis
│   └── output/                 # Generated reports
│
├── properties/                  # Your property documents
│   ├── kassel/
│   ├── munich/
│   └── [location]/
│
└── IMMO.md                     # Project summary
```

## Commands

### Setup & Status
| Command | Description |
|---------|-------------|
| `/immo:init` | Initialize project with investor profile |
| `/immo:status` | Show current state and next actions |
| `/immo:help` | Show command reference |
| `/immo:profile` | View/edit investor profile |

### Research
| Command | Description |
|---------|-------------|
| `/immo:scout [location]` | Research location (transport, market, Erbpacht) |
| `/immo:rates` | Research current mortgage interest rates |
| `/immo:add-location [name]` | Add new location to analyze |

### Analysis
| Command | Description |
|---------|-------------|
| `/immo:analyze [location]` | Analyze properties in location |
| `/immo:analyze-all` | Analyze all locations |
| `/immo:extract [file]` | Extract units from price list |

### Comparison
| Command | Description |
|---------|-------------|
| `/immo:filter [location]` | Apply rules, create shortlist |
| `/immo:exclude [unit] [reason]` | Exclude a unit with reason |
| `/immo:compare` | Side-by-side shortlist comparison |
| `/immo:stress-test` | Run stress scenarios |

### Reporting
| Command | Description |
|---------|-------------|
| `/immo:report [--lang XX]` | Generate advisor briefing |
| `/immo:summary` | Quick shortlist summary |

## Supported Countries

- 🇩🇪 **Germany** - Full support
  - Sonder-AfA §7b (special depreciation)
  - Spekulationsfrist (10-year tax-free sale)
  - Nebenkosten by state
  - Erbpacht detection

- 🇵🇹 **Portugal** - Planned
- 🇪🇸 **Spain** - Planned
- 🇳🇱 **Netherlands** - Planned

## Core Principles

1. **Never trust developer calculations** - Always verify independently from price lists
2. **Rank by real metrics** - Yield, price/m², not brochure IRR
3. **Include all costs** - Kitchen, parking, Nebenkosten, construction interest
4. **Show both phases** - Years 1-4 (with Sonder-AfA) AND Years 5-10
5. **Stress test everything** - What if appreciation is 0%?
6. **Research before recommending** - Check Erbpacht, transport, market

## Philosophy

IMMO rejects spreadsheet chaos in favor of systematic analysis:

- **Context is preserved** - STATE.md tracks where you are in analysis
- **Methodology is consistent** - Same rules applied to every property
- **Reports are professional** - Advisor-ready briefings from templates
- **Decisions are informed** - Clear frameworks for choosing between options

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](LICENSE) for details.

---

*IMMO: Making real estate investment analysis systematic.*

**Inspired by [GSD](https://github.com/glittercowboy/get-shit-done)** - the meta-prompting system for software development.
