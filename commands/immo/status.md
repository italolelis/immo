---
name: immo:status
description: Show current analysis state and recommended next action
allowed-tools:
  - Read
  - Bash
  - Glob
---

<objective>

Display current IMMO project status including:
- Workflow phase
- Locations and their analysis status
- Current shortlist
- Recommended next action

This is the "where am I?" command for orientation.

</objective>

<process>

## Step 1: Check Project Exists

```bash
[ -f .immo/config.json ] || echo "NO_PROJECT"
```

**If NO_PROJECT:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 IMMO ► NO PROJECT FOUND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No IMMO project in current directory.

To start: /immo:init
```
Exit.

## Step 2: Read State Files

Read:
- `.immo/config.json` - Investor profile
- `.immo/STATE.md` - Current state

## Step 3: Scan Locations

```bash
ls -d properties/*/ 2>/dev/null | xargs -I {} basename {}
```

For each location, check:
- `.immo/research/locations/[location].md` exists → SCOUTED
- `.immo/analysis/[location]/UNITS.md` exists → ANALYZED
- `.immo/analysis/[location]/SHORTLIST.md` exists → FILTERED

## Step 4: Display Status

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 IMMO ► STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project: [PROJECT_NAME]
Phase:   [CURRENT_PHASE]
Updated: [LAST_UPDATE]

───────────────────────────────────────────────────────
 INVESTOR PROFILE
───────────────────────────────────────────────────────

Income:       €[TOTAL]/year
Tax Rate:     [RATE]%
Available:    €[ASSETS]
Criteria:     ≥[YIELD]% yield, ≤€[PRICE], [SIZE]m²

───────────────────────────────────────────────────────
 LOCATIONS
───────────────────────────────────────────────────────

| Location | Status | Units | Shortlisted |
|----------|--------|-------|-------------|
| kassel   | ✅ FILTERED | 86 | 3 |
| munich   | 🔍 SCOUTED | - | - |
| taucha   | ❌ EXCLUDED | - | Quality |

───────────────────────────────────────────────────────
 SHORTLIST
───────────────────────────────────────────────────────

1. kassel/0.18 - €272k - 3.16% - 47.8m²
2. kassel/4.1  - €377k - 2.95% - 62.7m² - Parking ✅
3. kassel/3.7  - €401k - 3.20% - 73.8m²

───────────────────────────────────────────────────────
 NEXT ACTION
───────────────────────────────────────────────────────

[CONTEXTUAL RECOMMENDATION]

Examples:
- "Run /immo:scout munich to research Munich location"
- "Run /immo:analyze kassel to calculate metrics"
- "Run /immo:compare to compare shortlisted units"
- "Run /immo:report to generate advisor briefing"
```

## Step 5: Determine Next Action

Logic:
1. If no locations in properties/ → "Add property folders to properties/"
2. If locations exist but none scouted → "/immo:scout [first-location]"
3. If scouted but not analyzed → "/immo:analyze [location]"
4. If analyzed but not filtered → "/immo:filter [location]"
5. If multiple locations filtered → "/immo:compare"
6. If compared but no report → "/immo:report"
7. If report exists → "Ready to decide. Review report or /immo:stress-test"

</process>
