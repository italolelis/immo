---
name: immo:analyze
description: Analyze all properties in a location - extract units, calculate metrics, rank by yield
allowed-tools:
  - Read
  - Bash
  - Write
  - Glob
  - Grep
  - Task
---

<objective>

Analyze all properties in a location folder:
1. Extract units from price lists (Excel/PDF)
2. Calculate metrics (yield, price/m², cashflow)
3. Apply investor's tax rate for after-tax projections
4. Rank by real metrics (not brochure IRR)

**Creates:**
- `.immo/analysis/[location]/UNITS.md` — All extracted units
- `.immo/analysis/[location]/RANKED.md` — Sorted by metrics

**After this command:** Run `/immo:filter [location]` to apply criteria and create shortlist.

</objective>

<execution_context>

@~/.claude/immo/references/methodology.md
@~/.claude/immo/references/germany/tax-rules.md

</execution_context>

<process>

## Phase 1: Validation

**Check project and location:**
```bash
[ -f .immo/config.json ] || echo "NO_PROJECT"
[ -d "properties/$LOCATION" ] || echo "NO_LOCATION"
```

**Load investor config:**
Read `.immo/config.json` to get:
- `investor.marginalRate` — For tax benefit calculations
- `investor.country` — For country-specific rules
- `criteria.*` — For later filtering
- `assumptions.*` — For projections

## Phase 2: Find Price Lists

**Search for price list files:**
```bash
find "properties/$LOCATION" -type f \( -name "*[Pp]reis*" -o -name "*[Kk]aufpreis*" -o -name "*[Pp]rice*" \) \( -name "*.xlsx" -o -name "*.xls" -o -name "*.pdf" \)
```

**If Excel file found:** Extract data programmatically
**If PDF only:** May need manual extraction or OCR

## Phase 3: Extract Units

### From Excel Price List

For each row in the price list, extract:

| Field | Source Column (typical) |
|-------|------------------------|
| Unit ID | WE, Einheit, Unit |
| Floor | Etage, OG, Floor |
| Size (m²) | Wohnfläche, m², Size |
| Rooms | Zimmer, Rooms |
| Price | Kaufpreis, Price |
| Parking | Stellplatz, TG, Parking |
| Rent | Kaltmiete, Miete, Rent |
| Kitchen included | EBK, Küche |

**Calculate derived fields:**

```
Price per m² = Total Price ÷ Size
Gross Yield = (Monthly Rent × 12) ÷ Total Price × 100
```

### Handle Missing Rent Data

If rent not in price list, estimate:
- Check if developer calculation docs have rent estimates
- Use local market rate (€/m²) from research
- Flag as ESTIMATED

## Phase 4: Calculate Metrics Per Unit

**For each unit, calculate:**

### 4.1 Basic Metrics

```
Total Price = Unit Price + Kitchen (if not included) + Parking (if separate)
Price per m² = Total Price ÷ Size
Monthly Rent = Given or Estimated
Annual Rent = Monthly Rent × 12
Gross Yield = Annual Rent ÷ Total Price × 100
```

### 4.2 Upfront Cash

```
Nebenkosten = Total Price × NK_RATE (from config, typically 8%)
Construction Interest = Total Price × 50% × Interest Rate × (Construction Months ÷ 12)
Total Upfront = Nebenkosten + Construction Interest
```

### 4.3 Monthly Cashflow (Before Tax)

```
INCOME:
+ Monthly Rent

EXPENSES:
- Mortgage Payment = Total Price × (Interest Rate + Tilgung Rate) ÷ 12
- Verwaltung = Size × €1.00
- Rücklage = Size × €0.60

Real Deficit = Rent - Mortgage - Verwaltung - Rücklage
```

### 4.4 Tax Benefit Calculation

**Years 1-4 (with Sonder-AfA):**
```
Building Portion = Total Price × 92%
Annual Deductions:
  + Interest = Total Price × Interest Rate
  + Verwaltung = Size × €1.00 × 12
  + Sonder-AfA = Building Portion × 5%
  + Regular AfA = Building Portion × 2%

Tax Loss = Annual Rent - Annual Deductions
Tax Benefit Y1-4 = |Tax Loss| × Marginal Rate
Monthly Benefit Y1-4 = Tax Benefit Y1-4 ÷ 12
```

**Years 5-10 (Regular AfA only):**
```
Annual Deductions:
  + Interest (declining, estimate 85% of Y1)
  + Verwaltung
  + Regular AfA = Building Portion × 2%

Tax Loss = Annual Rent - Annual Deductions
Tax Benefit Y5-10 = |Tax Loss| × Marginal Rate
Monthly Benefit Y5-10 = Tax Benefit Y5-10 ÷ 12
```

### 4.5 After-Tax Cashflow

```
Cashflow Y1-4 = Real Deficit + Monthly Benefit Y1-4
Cashflow Y5-10 = Real Deficit + Monthly Benefit Y5-10
```

### 4.6 Exit Projection (Year 10)

```
Exit Value = Total Price × (1 + Appreciation Rate)^10
Sale Costs = Exit Value × 7%
Remaining Loan = Total Price × (1 - 10 years of Tilgung)
Net at Sale = Exit Value - Sale Costs - Remaining Loan

Total Cash Invested = Upfront + (Negative Cashflow over 10 years)
Profit = Net at Sale - Total Cash Invested
ROE = Profit ÷ Total Cash Invested × 100
```

## Phase 5: Write UNITS.md

Create `.immo/analysis/[location]/UNITS.md`:

```markdown
# Units Analysis: [LOCATION]

**Analyzed:** [DATE]
**Source:** [PRICE_LIST_FILE]
**Total Units:** [COUNT]

## Summary

| Metric | Min | Max | Avg |
|--------|-----|-----|-----|
| Price | €[MIN] | €[MAX] | €[AVG] |
| Size | [MIN]m² | [MAX]m² | [AVG]m² |
| Price/m² | €[MIN] | €[MAX] | €[AVG] |
| Yield | [MIN]% | [MAX]% | [AVG]% |

## All Units

| Unit | Floor | Size | Rooms | Price | €/m² | Rent | Yield | Parking |
|------|-------|------|-------|-------|------|------|-------|---------|
[TABLE OF ALL UNITS]

## Calculation Assumptions

| Parameter | Value | Source |
|-----------|-------|--------|
| Marginal Tax Rate | [RATE]% | Investor profile |
| Interest Rate | [RATE]% | [SOURCE] |
| Tilgung | [RATE]% | [SOURCE] |
| Nebenkosten | [RATE]% | [STATE] standard |
| Construction Period | [MONTHS] months | [SOURCE] |
| Appreciation | [RATE]%/year | Conservative |
| Verwaltung | €[RATE]/m²/month | Standard |
| Rücklage | €[RATE]/m²/month | Standard |
```

## Phase 6: Write RANKED.md

Create `.immo/analysis/[location]/RANKED.md`:

```markdown
# Ranked Units: [LOCATION]

**Ranked:** [DATE]
**Criteria:** Gross yield (primary), Price/m² (secondary)

## Top 10 by Yield

| Rank | Unit | Price | Size | Yield | €/m² | Parking | Cashflow Y1-4 | Cashflow Y5-10 |
|------|------|-------|------|-------|------|---------|---------------|----------------|
[TOP 10 BY YIELD]

## Top 10 by Value (Price/m²)

| Rank | Unit | Price | Size | Yield | €/m² | Parking | Floor |
|------|------|-------|------|-------|------|---------|-------|
[TOP 10 BY PRICE/M²]

## Units with Parking Included

| Unit | Price | Size | Yield | €/m² | Floor | Cashflow Y1-4 |
|------|-------|------|-------|------|-------|---------------|
[PARKING UNITS]

## Detailed Analysis: Top 5

[For each of top 5 by yield, show full calculation breakdown]

### [UNIT_ID]

**Basic Info:**
- Floor: [FLOOR]
- Size: [SIZE] m²
- Rooms: [ROOMS]
- Parking: [YES/NO]

**Pricing:**
- Unit Price: €[PRICE]
- Kitchen: [INCLUDED / €X]
- Parking: [INCLUDED / €X / NOT INCLUDED]
- **Total: €[TOTAL]**
- Price/m²: €[PRICE_M2]

**Income:**
- Monthly Rent: €[RENT]
- Annual Rent: €[ANNUAL]
- **Gross Yield: [YIELD]%**

**Upfront Cash:**
- Nebenkosten ([RATE]%): €[NK]
- Construction Interest: €[CONST_INT]
- **Total Upfront: €[TOTAL_UPFRONT]**

**Monthly Cashflow:**
```
Rent:           +€[RENT]
Mortgage:       -€[MORTGAGE]
Verwaltung:     -€[VERWALTUNG]
Rücklage:       -€[RUCKLAGE]
─────────────────────────────
Real Deficit:   €[DEFICIT]/month

Tax Benefit Y1-4:  +€[BENEFIT_Y1_4]
After-Tax Y1-4:    €[CASHFLOW_Y1_4]/month ✓

Tax Benefit Y5-10: +€[BENEFIT_Y5_10]
After-Tax Y5-10:   €[CASHFLOW_Y5_10]/month
```

**10-Year Projection:**
- Total Cash Invested: €[TOTAL_INVESTED]
- Exit Value (2%/yr): €[EXIT_VALUE]
- Net at Sale: €[NET_SALE]
- **Profit: €[PROFIT]**
- **ROE: [ROE]%**
```

## Phase 7: Update STATE.md

Update location status in STATE.md:
```markdown
| [location] | 📊 ANALYZED | [COUNT] | - | Active |
```

## Phase 8: Output Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 IMMO ► ANALYZE: [LOCATION]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Extracted [COUNT] units from [PRICE_LIST]

Yield Range:    [MIN]% - [MAX]%
Price Range:    €[MIN] - €[MAX]
Size Range:     [MIN]m² - [MAX]m²

Top 5 by Yield:
1. [UNIT] - [YIELD]% - €[PRICE] - [SIZE]m²
2. [UNIT] - [YIELD]% - €[PRICE] - [SIZE]m²
3. [UNIT] - [YIELD]% - €[PRICE] - [SIZE]m²
4. [UNIT] - [YIELD]% - €[PRICE] - [SIZE]m²
5. [UNIT] - [YIELD]% - €[PRICE] - [SIZE]m²

Units with Parking: [COUNT]

✅ Analysis saved:
   .immo/analysis/[location]/UNITS.md
   .immo/analysis/[location]/RANKED.md

📋 Next: /immo:filter [location] to apply criteria
```

</process>

<notes>

## Excel Extraction Tips

When reading Excel price lists:
- Headers are often in row 1 or 2
- Look for merged cells in headers
- Unit IDs may have prefixes (WE, Whg, etc.)
- Prices may be formatted with currency symbols
- Some cells may have formulas

## Handling Edge Cases

- **No rent data:** Use market rate estimate, flag as estimated
- **Multiple buildings:** Analyze as separate locations or combine
- **Missing parking info:** Assume no parking unless stated
- **Kitchen unclear:** Check exposé or assume not included

</notes>
