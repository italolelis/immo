---
name: immo:compare
description: Side-by-side comparison of shortlisted properties across all locations
allowed-tools:
  - Read
  - Write
  - Glob
  - Bash
---

<objective>

Create comprehensive side-by-side comparison of all shortlisted properties:
- Gather shortlists from all analyzed locations
- Present unified comparison table
- Provide decision framework for each option
- Highlight trade-offs

**Output:** Display comparison and update `.immo/STATE.md` with comparison status.

**After this command:** Run `/immo:stress-test` for scenarios, or `/immo:report` to generate advisor briefing.

</objective>

<process>

## Phase 1: Gather Shortlists

**Find all shortlist files:**
```bash
find .immo/analysis -name "SHORTLIST.md" 2>/dev/null
```

**For each shortlist, extract:**
- Location name
- Shortlisted units with all metrics

**If no shortlists found:**
"No shortlists created yet. Run `/immo:filter [location]` first."

## Phase 2: Load Investor Profile

Read `.immo/config.json` for:
- Liquid assets (for buffer calculation)
- Criteria (for highlighting matches)
- Preferences (parking, floor, etc.)

## Phase 3: Build Comparison Table

**Display banner:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 IMMO ► COMPARE SHORTLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Main Comparison Table:**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SHORTLIST COMPARISON                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Unit       │ Price    │ Upfront │ Size   │ Yield │ Parking │ Y1-4    │ Y5-10   │
├────────────┼──────────┼─────────┼────────┼───────┼─────────┼─────────┼─────────┤
│ kassel/0.18│ €272,403 │ €27,762 │ 47.8m² │ 3.16% │ ❌      │ +€175   │ -€351   │
│ kassel/4.1 │ €377,761 │ €38,503 │ 62.7m² │ 2.95% │ ✅      │ +€212   │ -€517   │
│ kassel/3.7 │ €401,535 │ €40,926 │ 73.8m² │ 3.20% │ ❌      │ +€262   │ -€514   │
└────────────┴──────────┴─────────┴────────┴───────┴─────────┴─────────┴─────────┘
```

**Extended Metrics Table:**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           10-YEAR PROJECTIONS                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Unit       │ Total Invested │ Exit Value │ Net at Sale │ Profit  │ ROE    │
├────────────┼────────────────┼────────────┼─────────────┼─────────┼────────┤
│ kassel/0.18│ €44,634        │ €332,015   │ €75,274     │ €30,640 │ 69%    │
│ kassel/4.1 │ €65,551        │ €460,468   │ €104,535    │ €38,984 │ 59%    │
│ kassel/3.7 │ €65,358        │ €489,471   │ €111,108    │ €45,750 │ 70%    │
└────────────┴────────────────┴────────────┴─────────────┴─────────┴────────┘
```

## Phase 4: Metric Winners

**Highlight best in each category:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WINNERS BY METRIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏆 Lowest Price:        kassel/0.18 (€272,403)
🏆 Lowest Upfront:      kassel/0.18 (€27,762)
🏆 Highest Yield:       kassel/3.7 (3.20%)
🏆 Best €/m²:           kassel/3.7 (€5,445)
🏆 Parking Included:    kassel/4.1
🏆 Best Y1-4 Cashflow:  kassel/3.7 (+€262/mo)
🏆 Lowest Y5-10 Bleed:  kassel/0.18 (-€351/mo)
🏆 Highest Profit:      kassel/3.7 (€45,750)
🏆 Highest ROE:         kassel/3.7 (70%)
🏆 Largest Unit:        kassel/3.7 (73.8m²)
```

## Phase 5: Liquidity Impact

**Show remaining buffer after each option:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 LIQUIDITY IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available Assets: €[LIQUID_ASSETS]

│ Unit       │ Upfront  │ Remaining │ Y5-10 Annual │ Buffer Years │
├────────────┼──────────┼───────────┼──────────────┼──────────────┤
│ kassel/0.18│ €27,762  │ €212,238  │ €4,212       │ 50 years     │
│ kassel/4.1 │ €38,503  │ €201,497  │ €6,204       │ 32 years     │
│ kassel/3.7 │ €40,926  │ €199,074  │ €6,168       │ 32 years     │

✅ All options leave comfortable buffers.
```

## Phase 6: Decision Framework

**Present "Choose X if..." for each option:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 DECISION FRAMEWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────┐
│ CHOOSE kassel/0.18 IF:                              │
├─────────────────────────────────────────────────────┤
│ • Capital preservation is your priority             │
│ • You want to test the waters with minimal risk     │
│ • You're okay with smaller unit (47.8m²)            │
│ • Ground floor doesn't concern you                  │
│ • You might want a SECOND property later            │
│                                                     │
│ TRADE-OFF: Smallest unit, no parking, ground floor  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ CHOOSE kassel/4.1 IF:                               │
├─────────────────────────────────────────────────────┤
│ • Parking is important for rentability              │
│ • You value top floor location (premium)            │
│ • You want bundled, simple transaction              │
│ • You accept lower yield (2.95%) for convenience    │
│                                                     │
│ TRADE-OFF: Lowest yield, highest €/m²               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ CHOOSE kassel/3.7 IF:                               │
├─────────────────────────────────────────────────────┤
│ • Maximum returns are your priority                 │
│ • You want largest unit (73.8m²)                    │
│ • You believe parking not essential (good transport)│
│ • You want best yield (3.20%) and profit (€45,750)  │
│                                                     │
│ TRADE-OFF: No parking, higher capital required      │
└─────────────────────────────────────────────────────┘
```

## Phase 7: Parking Consideration

**If mixed parking options exist:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PARKING ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If parking is ESSENTIAL for you:

Option A: Buy kassel/4.1 (parking included)
  Total: €377,761
  Already bundled, no extra hassle

Option B: Buy kassel/3.7 + parking separately
  Unit: €401,535
  Parking: ~€25,000
  Total: €426,535
  €48,774 MORE than 4.1, but 11m² larger

Based on location research:
[PARKING_VERDICT from scout] - [REASONING]
```

## Phase 8: Next Actions

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 /immo:stress-test    Run 0% appreciation & rate hike scenarios
📝 /immo:report         Generate advisor briefing
📝 /immo:report --lang pt  Generate in Portuguese

When ready to decide:
• Visit the development if possible
• Confirm financing with bank
• Consult your tax advisor
• Reserve your chosen unit
```

## Phase 9: Update STATE.md

Update state to reflect comparison done:
```markdown
### Phase: COMPARED
### Last Action: Side-by-side comparison of [N] shortlisted units
```

</process>
