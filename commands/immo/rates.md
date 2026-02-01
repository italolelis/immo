---
name: immo:rates
description: Research current mortgage interest rates and compare with developer rates
allowed-tools:
  - Read
  - Write
  - WebSearch
  - WebFetch
  - Bash
---

<objective>

Research current mortgage interest rates in Germany:
1. Search for current market rates
2. Compare with developer-provided rates
3. Calculate potential savings
4. Provide negotiation recommendations

**Creates:** `.immo/research/market/RATES-[DATE].md`

</objective>

<process>

## Phase 1: Web Research

**Search for current rates:**

Queries:
- "Baufinanzierung Zinsen aktuell [current year]"
- "Hypothekenzinsen [current month] [current year]"
- "mortgage rates Germany [current year]"

**Target sources:**
- Dr. Klein (drklein.de)
- Baufi24 (baufi24.de)
- Interhyp (interhyp.de)
- Finanztip (finanztip.de)

## Phase 2: Extract Rate Data

**For each fixed period, extract:**

| Period | Top Rate | Typical Range |
|--------|----------|---------------|
| 5 years | X.XX% | X.XX% - X.XX% |
| 10 years | X.XX% | X.XX% - X.XX% |
| 15 years | X.XX% | X.XX% - X.XX% |
| 20 years | X.XX% | X.XX% - X.XX% |

**Note effective date of data.**

## Phase 3: Compare with Developer Rate

**Load developer rate from analysis:**
- Check `.immo/analysis/*/RANKED.md` for assumed rate
- Or from config assumptions

**Calculate difference:**
```
Developer rate:    X.XX%
Market top rate:   X.XX%
Difference:        X.XX%
```

## Phase 4: Calculate Savings

**For each shortlisted unit, calculate:**

```
Loan amount: €[PRICE]
10-year difference at 0.15% lower rate:

Monthly interest savings: Loan × 0.15% ÷ 12
Annual savings: Monthly × 12
10-year savings: Annual × 10 (simplified)
```

## Phase 5: Rate Forecast

**Search for forecasts:**
- "Zinsprognose [current year]"
- "mortgage rate forecast Germany"

**Extract:**
- Expected direction (up/down/stable)
- Expected range
- Key factors (ECB policy, inflation)

## Phase 6: Write Research File

Create `.immo/research/market/RATES-[DATE].md`:

```markdown
# Interest Rate Research

**Date:** [DATE]
**Sources:** [LIST]

## Current Market Rates

| Fixed Period | Top Rate | Typical Range | Notes |
|--------------|----------|---------------|-------|
| 5 years | X.XX% | X.XX% - X.XX% | |
| 10 years | X.XX% | X.XX% - X.XX% | Most common |
| 15 years | X.XX% | X.XX% - X.XX% | |
| 20 years | X.XX% | X.XX% - X.XX% | |

**Effective date:** [DATE]

## Comparison with Developer Rate

| Metric | Developer | Market Top | Difference |
|--------|-----------|------------|------------|
| 10-year fixed | X.XX% | X.XX% | X.XX% |

**Assessment:** Developer rate is [ABOVE/AT/BELOW] current market.

## Savings Potential

**If investor achieves market top rate:**

| Unit | Loan | Monthly Savings | 10-Year Savings |
|------|------|-----------------|-----------------|
| [UNIT] | €[LOAN] | €[MONTHLY] | €[TOTAL] |

## Why Investor Should Get Better Rate

1. **High income:** €[INCOME]/year = excellent repayment capacity
2. **Strong assets:** €[ASSETS] liquid = low risk for bank
3. **Stable employment:** [IF KNOWN]
4. **No significant debts:** Good debt-to-income ratio

## Rate Forecast

**[TIMEFRAME] Outlook:**
- Direction: [UP/DOWN/STABLE]
- Expected range: X.XX% - X.XX%
- Key factors: [FACTORS]

**Source:** [SOURCE]

## Recommendation

### Target Rate: X.XX% - X.XX%

### Institutions to Quote

1. **Interhyp** - Broker, compares 500+ banks
2. **Dr. Klein** - Broker
3. **ING-DiBa** - Direct bank, often competitive
4. **Investor's main bank** - May offer loyalty discount

### Negotiation Tips

- Get quotes from 3+ sources before deciding
- Use competing offers as leverage
- Ask about special conditions for high income
- Consider shorter fixed period if rates expected to drop
- Factor in fees when comparing (some brokers charge)

## Sources

[List all sources with URLs and access dates]
```

## Phase 7: Output Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 IMMO ► INTEREST RATE RESEARCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Current Market Rates (10-year fixed):
   Top rate:     X.XX%
   Typical:      X.XX% - X.XX%

📈 Developer Rate: X.XX%
   Difference:   X.XX% ABOVE market

💰 Potential Savings:
   [UNIT]: €X,XXX over 10 years
   [UNIT]: €X,XXX over 10 years

🎯 Target Rate: X.XX% - X.XX%

✅ Research saved: .immo/research/market/RATES-[DATE].md

📋 Recommendation:
   Quote Interhyp, Dr. Klein, and your bank before accepting
   developer's rate. Your profile should qualify for top rates.
```

</process>
