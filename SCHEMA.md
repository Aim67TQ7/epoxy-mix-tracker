# Epoxy Mix Log - Database Schema

## Overview

This application uses Supabase as the backend database. The primary table stores epoxy mixing ratio checks and quality control data.

---

## Table: `EpoxyMix`

### Purpose
Records epoxy mixing ratio measurements and daily quality checks for manufacturing process control.

### Schema

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `UUID` | `string` | ✓ | Primary key - unique identifier (UUID v4) |
| `Timestamp` | `string` | | ISO 8601 timestamp of record creation |
| `Employee` | `number` | | Employee badge ID (2-4 digits) |
| `Part A` | `string` | | Gross weight of Part A (cup + epoxy) |
| `Part B` | `string` | | Gross weight of Part B (cup + hardener) |
| `Cup A` | `string` | | Tare weight of empty Cup A |
| `Cup B` | `string` | | Tare weight of empty Cup B |
| `Ratio` | `string` | | Calculated ratio: (Part A - Cup A) ÷ (Part B - Cup B) |
| `Daily Check` | `string` | | "Yes" if daily check was performed |
| `Startup` | `string` | | "Yes" if startup check was performed |
| `Shutdown` | `string` | | "Yes" if shutdown check was performed |
| `Ratio Check` | `string` | | "Yes" if ratio check was performed |
| `Humidity_1` | `string` | | Humidity sensor reading 1 (reserved) |
| `Humidity_2` | `string` | | Humidity sensor reading 2 (reserved) |
| `Temperature_1` | `string` | | Temperature sensor reading 1 (reserved) |
| `Temperature_2` | `string` | | Temperature sensor reading 2 (reserved) |
| `Sensor_Timestamp` | `string` | | Timestamp from sensor readings (reserved) |

---

## Ratio Calculation

```
Net A = Part A - Cup A
Net B = Part B - Cup B
Ratio = Net A ÷ Net B
```

### Acceptable Range
- **Lower Control Limit (LCL):** 11.878
- **Center Line (CL):** 12.12
- **Upper Control Limit (UCL):** 12.362

---

## Check Types

| Type | Purpose | Requires Ratio |
|------|---------|----------------|
| `startup` | Beginning of shift verification | No |
| `daily` | Routine daily check | No |
| `shutdown` | End of shift verification | No |
| `ratio` | Mix ratio measurement | Yes |

---

## Data Flow

1. **Employee enters badge ID** (2-4 digits, required)
2. **Selects check type** (Startup, Daily, Shutdown, or Ratio)
3. **If Ratio check:**
   - Enter Part A weight (cup full)
   - Enter Cup A weight (cup empty)
   - Enter Part B weight (cup full)
   - Enter Cup B weight (cup empty)
   - System calculates ratio automatically
4. **Submit** - Record saved to Supabase
5. **Result displayed** - Pass/Fail based on control limits

---

## TypeScript Interface

```typescript
interface EpoxyMixRecord {
  UUID: string;
  Timestamp: string | null;
  Employee: number | null;
  "Part A": string | null;
  "Part B": string | null;
  "Cup A": string | null;
  "Cup B": string | null;
  Ratio: string | null;
  "Daily Check": string | null;
  Startup: string | null;
  Shutdown: string | null;
  "Ratio Check": string | null;
  Humidity_1: string | null;
  Humidity_2: string | null;
  Temperature_1: string | null;
  Temperature_2: string | null;
  Sensor_Timestamp: string | null;
}
```

---

## Notes

- All weight values stored as strings to preserve decimal precision
- Ratio calculated to 3 decimal places
- Sensor columns reserved for future IoT integration
- Employee ID validated client-side (2-4 numeric digits)
