# Epoxy Mix Log - User Guide

## Overview

The Epoxy Mix Log is a tracking application for recording and monitoring epoxy mixture ratios. It calculates the ratio between Part A and Part B components (accounting for cup weights) and validates whether the mixture is within acceptable limits.

---

## How to Use

### Step 1: Enter Your Employee ID
- Enter your **2-4 digit Employee ID** in the first field
- This field is **required** for all submissions

### Step 2: Select Check Type (Optional)
Choose one of the following check types by tapping the button:
- **Startup** - Beginning of shift check
- **Daily** - Regular daily verification
- **Shutdown** - End of shift check

> **Note:** Check Type is required if you're not entering weight measurements.

### Step 3: Enter Weight Measurements

#### Part A Column:
1. **Part A** - Enter the total weight of Part A (including cup)
2. **Cup A** - Enter the empty cup weight for Part A

#### Part B Column:
1. **Part B** - Enter the total weight of Part B (including cup)
2. **Cup B** - Enter the empty cup weight for Part B

### Step 4: Review the Ratio
The app automatically calculates and displays the ratio using this formula:

```
Ratio = (Part A - Cup A) ÷ (Part B - Cup B)
```

**Acceptable Range: 11.878 - 12.362**

### Step 5: Add Comments (Optional)
Enter any optional notes or comments about the mixture.

### Step 6: Submit
Press the green **Submit** button to save your entry.

---

## Understanding Results

### ✅ Acceptable (Green Screen)
- Ratio is within the acceptable range (11.878 - 12.362)
- Entry has been saved successfully
- Press **New Entry** to log another mixture

### ⚠️ Out of Range (Red Screen)
- Ratio is outside the acceptable range
- **RETEST REQUIRED**
- Contact your Supervisor if the problem persists
- Press **New Entry** to try again

---

## Viewing History

Press the **View History** button to access:

### SPC Chart Tab
- Visual chart showing ratio values over time
- Green area indicates acceptable range
- Points outside the range are highlighted

### Check Log Tab
- Daily summary of Startup, Daily, and Shutdown checks
- Shows which checks have been completed each day

### Export Data
- Click **Download Excel** to export all records as a spreadsheet

---

## Quick Reference

| Field | Required? | Format |
|-------|-----------|--------|
| Employee ID | ✅ Yes | 2-4 digits |
| Check Type | Conditional* | Startup/Daily/Shutdown |
| Part A | Optional | Decimal number |
| Cup A | Optional | Decimal number |
| Part B | Optional | Decimal number |
| Cup B | Optional | Decimal number |
| Comments | Optional | Free text |

*Check Type is required when no weight measurements are entered.

---

## Acceptable Ratio Range

**Target Ratio:** 12.12 (center)  
**Lower Limit:** 11.878  
**Upper Limit:** 12.362

---

## Troubleshooting

**"Invalid Employee ID"**  
→ Enter a 2-4 digit number only

**"Check Type Required"**  
→ Select Startup, Daily, or Shutdown when not entering measurements

**Ratio shows "—"**  
→ Enter all four weight values (Part A, Cup A, Part B, Cup B)

**Out of Range result**  
→ Retest with a new mixture; contact Supervisor if issue persists
