# Statistical Process Control (SPC) Guide

## Overview

This application implements Statistical Process Control for monitoring epoxy mixing ratios. SPC is a quality control method that uses statistical analysis to monitor and control manufacturing processes.

---

## Control Limits

| Limit | Value | Description |
|-------|-------|-------------|
| **UCL** (Upper Control Limit) | 12.362 | Maximum acceptable ratio |
| **CL** (Center Line) | 12.12 | Target/nominal ratio |
| **LCL** (Lower Control Limit) | 11.878 | Minimum acceptable ratio |

### Specification Basis
- Target ratio: **12.12:1** (Part A to Part B by weight)
- Tolerance: **±2%** from center line
- UCL = 12.12 × 1.02 = 12.362
- LCL = 12.12 × 0.98 = 11.878

---

## SPC Chart Implementation

### Chart Type
**X-Chart (Individuals Chart)** - Plots individual ratio measurements over time.

### Visual Elements

| Element | Color | Style | Purpose |
|---------|-------|-------|---------|
| UCL Line | Red | Dashed | Upper boundary |
| CL Line | Primary (Amber) | Dashed | Target centerline |
| LCL Line | Red | Dashed | Lower boundary |
| In-Range Points | Green | Solid dot | Acceptable readings |
| Out-of-Range Points | Red | Solid dot | Failed readings |
| Trend Line | Primary | Solid | Connects data points |

### Code Reference
```typescript
// src/components/SPCChart.tsx
const LOWER_LIMIT = 11.878;
const UPPER_LIMIT = 12.362;
const CENTER_LINE = 12.12;
```

---

## Interpreting the Chart

### Pass Criteria
- Ratio falls **between** LCL and UCL (inclusive)
- Point displayed in **green**

### Fail Criteria
- Ratio falls **outside** LCL or UCL
- Point displayed in **red**
- Requires **retest**
- Contact supervisor if problem persists

---

## Western Electric Rules (Future Enhancement)

Standard SPC practice includes detecting these patterns:

| Rule | Pattern | Action |
|------|---------|--------|
| 1 | 1 point beyond 3σ | Immediate investigation |
| 2 | 2 of 3 consecutive points beyond 2σ | Warning |
| 3 | 4 of 5 consecutive points beyond 1σ | Warning |
| 4 | 8 consecutive points on one side of CL | Trend investigation |

*Note: Current implementation uses simple limit checking. Western Electric rules can be added for advanced pattern detection.*

---

## Data Requirements

### For Valid SPC Analysis
- **Minimum 20-25 data points** for establishing baseline
- **Consistent measurement method** (same scale, same procedure)
- **Random sampling** over time
- **Stable process** before setting control limits

### Chart Displays
- X-axis: Timestamp (MM/DD HH:mm format)
- Y-axis: Ratio value (range: 11.5 - 12.8)
- Data sorted chronologically

---

## Process Capability

### Cp (Process Capability Index)
```
Cp = (UCL - LCL) / (6 × σ)
```

### Cpk (Process Capability Index - Centered)
```
Cpk = min[(UCL - μ) / (3 × σ), (μ - LCL) / (3 × σ)]
```

Where:
- σ = process standard deviation
- μ = process mean

### Target Values
| Cpk | Rating |
|-----|--------|
| < 1.0 | Poor - Process not capable |
| 1.0 - 1.33 | Marginal - Needs improvement |
| 1.33 - 1.67 | Good - Acceptable |
| > 1.67 | Excellent - Highly capable |

---

## Calibration & Maintenance

### Scale Calibration
- Verify scale accuracy daily before first use
- Use certified calibration weights
- Document calibration in startup check

### Control Limit Review
- Review limits quarterly
- Recalculate if process changes significantly
- Document any limit adjustments

---

## Response Protocol

### In-Range Result
1. ✓ Record accepted
2. Continue normal operations

### Out-of-Range Result
1. ⚠️ Stop mixing operations
2. Retest with fresh sample
3. If second test fails:
   - Contact supervisor immediately
   - Do not use mixed material
   - Document issue in comments
4. Investigate root cause:
   - Scale calibration
   - Material lot variation
   - Procedure deviation
   - Equipment malfunction

---

## References

- ASTM E2587 - Standard Practice for Use of Control Charts
- ISO 7870 - Control Charts
- Montgomery, D.C. - Introduction to Statistical Quality Control
