# Deadzone Implementation Documentation

## Overview

This document explains the deadzone normalization improvements implemented in GameInputJS.

## Problem Statement

Previously, when applying deadzones to gamepad input:
- Values within the deadzone were correctly filtered to zero
- However, values outside the deadzone were **not normalized**
- This meant the deadzone edge value (e.g., 0.2) remained at 0.2 instead of mapping to 0
- This created a "jump" in input values at the deadzone boundary

## Solution

The implementation now properly normalizes deadzone values following the standard approach outlined in:
- Article: "Input is Hard: Deadzones" by Gaeel Bradshaw-Rodriguez
- Reference: https://gist.github.com/Bradshaw/24553c2a82543f2016dc52e88d2202a8

### Normalization Formula

For any input value outside the deadzone:

```
normalized = (|value| - deadzone) / (max - deadzone)
```

This ensures:
1. Values within deadzone → 0
2. Deadzone edge → 0 (not the raw deadzone value)
3. Maximum input → 1.0 (unchanged)
4. The range [deadzone, max] is rescaled to [0, 1]

## Implementation Details

### Per-Axis Normalization (`getStickVector()`)

The `getStickVector()` method applies per-axis deadzone normalization using the new `#normalizeAxisWithDeadzone()` helper:

```javascript
#normalizeAxisWithDeadzone(value, deadzone, max) {
    const absValue = Math.abs(value)
    const absDeadzone = Math.abs(deadzone)
    const absMax = Math.abs(max)

    // If within deadzone, return 0
    if (absValue <= absDeadzone) {
        return 0
    }

    // Normalize to [0, absMax] range after deadzone
    const normalized = (absValue - absDeadzone) / (absMax - absDeadzone)

    // Clamp to [0, 1] to ensure we don't exceed bounds
    const clamped = Math.min(normalized, 1)

    return value < 0 ? -clamped : clamped
}
```

### Radial Deadzone Normalization (`getNormalizedStickVector()`)

The `getNormalizedStickVector()` method applies radial (circular) deadzone:

1. Calculate stick magnitude
2. If magnitude < deadzone: return zero vector
3. Otherwise: normalize direction and scale by adjusted magnitude

```javascript
const scaledMagnitude = Math.min(
    (stickInput.magnitude() - radialDeadZone) / (1 - radialDeadZone),
    1
)
return stickInput.normalize().scale(scaledMagnitude)
```

This matches the reference implementation exactly.

## Example

### Before (Without Normalization)

With a deadzone of 0.2:
- Input 0.0 → Output 0.0
- Input 0.1 → Output 0.0 (within deadzone)
- Input 0.2 → Output 0.2 ❌ (deadzone edge has non-zero output)
- Input 0.5 → Output 0.5
- Input 1.0 → Output 1.0

### After (With Normalization)

With a deadzone of 0.2:
- Input 0.0 → Output 0.0
- Input 0.1 → Output 0.0 (within deadzone)
- Input 0.2 → Output 0.0 ✓ (deadzone edge now maps to 0)
- Input 0.5 → Output 0.375 = (0.5 - 0.2) / (1.0 - 0.2)
- Input 1.0 → Output 1.0 ✓ (maximum unchanged)

## Benefits

1. **Smoother Input**: No sudden jump at deadzone boundary
2. **Better Control**: Full range of motion is utilized
3. **Standard Behavior**: Matches industry-standard deadzone handling
4. **Predictable Response**: Linear mapping from deadzone edge to maximum

## Testing

Comprehensive tests added in `gameinput-player-deadzone.test.js`:
- Per-axis deadzone normalization
- Radial deadzone normalization
- Edge cases (deadzone edge, maximum values, negative values)
- Verification against mathematical formulas

## Backward Compatibility

The changes are backward compatible:
- Existing code continues to work
- Only the internal normalization behavior has changed
- The API surface remains unchanged
