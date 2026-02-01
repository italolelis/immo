---
name: immo:filter
description: Apply investment criteria to analyzed units and create shortlist
allowed-tools:
  - Read
  - Write
  - Glob
  - Bash
---

<objective>

Apply investor's criteria to analyzed units and create a filtered shortlist:
1. Load criteria from config
2. Apply filters (yield, price, size, parking, floor)
3. Document exclusions with reasons
4. Create shortlist of qualifying units

**Creates:**
- `.immo/analysis/[location]/SHORTLIST.md` — Qualifying units
- `.immo/analysis/[location]/EXCLUSIONS.md` — Excluded units with reasons

**After this command:** Run `/immo:compare` to compare across locations.

</objective>

<process>

## Phase 1: Load Data

**Load config:**
Read `.immo/config.json` for criteria:
- `criteria.minYield`
- `criteria.maxPrice`
- `criteria.minSize` / `criteria.maxSize`
- `criteria.bedrooms`
- `criteria.parkingRequired`
- `criteria.excludeGroundFloor`
- `criteria.excludeErbpacht`

**Load analyzed units:**
Read `.immo/analysis/[location]/UNITS.md`

## Phase 2: Apply Filters

**For each unit, check against criteria:**

```
PASS/FAIL Criteria:
─────────────────────────────────────────
□ Yield ≥ [minYield]%
□ Price ≤ €[maxPrice]
□ Size between [minSize] - [maxSize] m²
□ Bedrooms in [bedrooms] list
□ If parkingRequired: has parking
□ If excludeGroundFloor: not ground floor
□ If excludeErbpacht: no Erbpacht detected
```

**Track exclusion reasons:**
- "Yield below minimum (X% < Y%)"
- "Price exceeds maximum (€X > €Y)"
- "Size outside range (Xm²)"
- "Wrong bedroom count"
- "No parking (required)"
- "Ground floor (excluded)"

## Phase 3: Rank Qualifying Units

**Sort qualifying units by:**
1. Gross yield (descending)
2. Price per m² (ascending)
3. Cashflow Y1-4 (descending)

## Phase 4: Write SHORTLIST.md

Create `.immo/analysis/[location]/SHORTLIST.md`:

```markdown
# Shortlist: [LOCATION]

**Filtered:** [DATE]
**Total Units Analyzed:** [TOTAL]
**Units Qualifying:** [QUALIFYING]
**Units Excluded:** [EXCLUDED]

## Criteria Applied

| Criterion | Value | Units Excluded |
|-----------|-------|----------------|
| Min Yield | [X]% | [N] |
| Max Price | €[X] | [N] |
| Size Range | [X]-[Y] m² | [N] |
| Bedrooms | [X] | [N] |
| Parking Required | [YES/NO] | [N] |
| Exclude Ground Floor | [YES/NO] | [N] |

## Shortlisted Units

| Rank | Unit | Price | Size | Yield | €/m² | Parking | Floor | Y1-4 | Y5-10 | Profit |
|------|------|-------|------|-------|------|---------|-------|------|-------|--------|
[SHORTLIST TABLE]

## Top 3 Detailed

### 1. [UNIT_ID] — [HEADLINE]

[Full analysis breakdown - same format as RANKED.md top 5]

### 2. [UNIT_ID] — [HEADLINE]

[Full analysis breakdown]

### 3. [UNIT_ID] — [HEADLINE]

[Full analysis breakdown]

## Selection Notes

[Any observations about the shortlist - e.g., "All top units lack parking but location research indicates parking not essential"]
```

## Phase 5: Write EXCLUSIONS.md

Create `.immo/analysis/[location]/EXCLUSIONS.md`:

```markdown
# Exclusions: [LOCATION]

**Date:** [DATE]
**Total Excluded:** [COUNT]

## By Reason

| Reason | Count | % of Total |
|--------|-------|------------|
| Yield below [X]% | [N] | [%] |
| Price above €[X] | [N] | [%] |
| Size out of range | [N] | [%] |
| No parking | [N] | [%] |
| Ground floor | [N] | [%] |

## Excluded Units

| Unit | Price | Yield | Reason |
|------|-------|-------|--------|
[EXCLUSION TABLE]

## Near Misses

Units that ALMOST qualified (within 10% of criteria):

| Unit | Price | Yield | Issue | How Close |
|------|-------|-------|-------|-----------|
[NEAR MISS TABLE]
```

## Phase 6: Update STATE.md

Update location status:
```markdown
| [location] | ✅ FILTERED | [TOTAL] | [SHORTLIST_COUNT] | Active |
```

## Phase 7: Output Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 IMMO ► FILTER: [LOCATION]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Criteria Applied:
  Min Yield:     [X]%
  Max Price:     €[X]
  Size Range:    [X]-[Y] m²
  Parking:       [Required/Preferred/Any]
  Ground Floor:  [Excluded/Allowed]

Results:
  Analyzed:      [TOTAL] units
  Excluded:      [EXCLUDED] units
  Shortlisted:   [QUALIFYING] units

Shortlist:
1. [UNIT] - €[PRICE] - [YIELD]% - [SIZE]m² [PARKING]
2. [UNIT] - €[PRICE] - [YIELD]% - [SIZE]m² [PARKING]
3. [UNIT] - €[PRICE] - [YIELD]% - [SIZE]m² [PARKING]

✅ Saved:
   .immo/analysis/[location]/SHORTLIST.md
   .immo/analysis/[location]/EXCLUSIONS.md

📋 Next:
   /immo:filter [other-location]  Filter another location
   /immo:compare                  Compare all shortlists
```

</process>

<edge_cases>

## No Units Qualify

If zero units pass all criteria:

```
⚠️ No units in [LOCATION] meet all criteria.

Closest matches:
[Show top 5 by fewest criteria failures]

Consider:
• Relaxing minYield from [X]% to [Y]%
• Increasing maxPrice from €[X] to €[Y]
• Adjusting size range

To adjust: /immo:set minYield [new-value]
```

## Very Few Units Qualify

If <3 units qualify, suggest relaxing least important criteria.

## Manual Exclusions

If user has manually excluded units via `/immo:exclude`, respect those:
```
Additionally excluded by user:
• [UNIT] - "[REASON]"
```

</edge_cases>
