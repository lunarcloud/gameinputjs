# GitHub Copilot Instructions for GameInputJS

This file provides specific context and instructions for AI coding agents to
interact effectively with this JavaScript library project.

## Project Overview

GameInputJS is a client-side JavaScript ES module library that enhances the browser Gamepad API experience. It provides:
- Automatic gamepad model detection and button mapping
- Support for multiple input patterns (event-driven and game-loop polling)
- Vendor-specific theming (Xbox, PlayStation, Nintendo)
- Standard and custom gamepad mappings
- Rumble/vibration support

The library is designed to be distributed directly (no bundling) with source files accessible to web applications.

## Technologies and Dependencies

* **Language**: JavaScript ES2023 (ES Modules)
* **Runtime**: Browser-only (no Node.js runtime dependencies)
* **Type System**: JSDoc (no TypeScript - type information in comments)
* **Testing**: Jest with jsdom environment
* **Linting**: ESLint with eslint-config-standard, editorconfig, and jsdoc plugins
* **Documentation**: JSDoc for API documentation generation

**Key Principle**: This project intentionally has **zero runtime dependencies**. All functionality is self-contained.

## Project Structure

```
/src/                           # All source code (distributed as-is)
  ├── gameinput.js             # Main GameInput class (entry point)
  ├── gameinput-player.js      # Per-player gamepad state and control
  ├── gameinput-model.js       # Gamepad model/hardware identification
  ├── gameinput-models.js      # Database of specific gamepad models
  ├── gameinput-schema.js      # Button naming schemes (Xbox, PlayStation, Nintendo)
  ├── gameinput-state.js       # Button/axis state tracking
  ├── gameinput-options.js     # Configuration options
  ├── gamepad-mapping.js       # Button/axis mapping logic
  ├── standard-gamepad-mapping.js # Standard Gamepad API mapping
  ├── vector2.js               # 2D vector for joystick positions
  ├── axis-as-button.js        # Treat analog axis as digital button
  ├── combined-axis-as-button.js # Combine multiple axes as button
  ├── os-detect.js             # Operating system detection
  └── *.test.js                # Jest unit tests (co-located with source)
/demo/                          # Demo/example usage
/img/                           # Gamepad icon images
/dist/                          # Build output (not in git)
package.json                    # NPM project configuration
.eslintrc.json                  # ESLint configuration
.editorconfig                   # Editor formatting rules
tsconfig.json                   # TypeScript config (for JSDoc checking only)
jsconfig.json                   # JavaScript IDE configuration
jsdoc.conf.json                 # JSDoc documentation generation config
```

## Development Commands

**Initial Setup**:
```bash
npm install              # Install development dependencies
```

**Development Workflow**:
```bash
npm run lint             # Run ESLint on all JavaScript files
npm run lint-fix         # Auto-fix ESLint errors where possible
npm test                 # Run all Jest tests
npm run build            # Build distributable version to /dist/
npm run serve            # Build and serve demo locally
npm run docs             # Generate JSDoc API documentation
npm run build-prod       # Build everything (dist + docs)
```

**Before Committing**:
Always run `npm run lint-fix` and `npm test` before committing changes.

## Code Style and Conventions

### General JavaScript Style

* **Module System**: Use ES modules (`import`/`export`) exclusively
* **Indentation**: 4 spaces (enforced by EditorConfig)
* **Line Endings**: LF (Unix style)
* **Quotes**: Single quotes for strings
* **Semicolons**: Not required by linter, but commonly used
* **Max Line Length**: No limit (but keep reasonable)
* **Braces**: Optional for single-line blocks (curly: 0 rule)

### JSDoc Requirements

**All public APIs must have JSDoc comments.** This project uses JSDoc as its type system.

```javascript
/**
 * Brief description of the function
 * @param {string} name - Parameter description
 * @param {number} [optional] - Optional parameter (note the brackets)
 * @returns {boolean} Return value description
 * @throws {Error} When invalid input provided
 */
function exampleFunction(name, optional) {
    // ...
}

/**
 * Example class
 * @class
 */
class ExampleClass {
    /**
     * Property description
     * @type {string}
     */
    propertyName

    /**
     * Constructor description
     * @param {Object} options - Configuration object
     * @param {string} options.name - Name property
     */
    constructor(options) {
        // ...
    }

    /**
     * Method description
     * @returns {void}
     */
    methodName() {
        // ...
    }
}
```

### Common Patterns

#### Module Exports

Export classes and functions as named exports:

```javascript
/**
 * @class GameInput
 */
export class GameInput {
    // ...
}

/**
 * Detect the operating system
 * @returns {string} OS name
 */
export function detectOS() {
    // ...
}
```

#### Class Structure

```javascript
/**
 * Class description
 * @class
 */
class MyClass {
    /**
     * Static property
     * @type {number}
     * @static
     */
    static DefaultValue = 10

    /**
     * Instance property
     * @type {string}
     */
    instanceProperty = ''

    /**
     * Constructor
     * @param {Object} config - Configuration
     */
    constructor(config) {
        this.instanceProperty = config.value
    }

    /**
     * Instance method
     * @param {number} value - Input value
     * @returns {number} Processed value
     */
    processValue(value) {
        return value * 2
    }

    /**
     * Static method
     * @returns {MyClass} New instance
     * @static
     */
    static create() {
        return new MyClass({ value: 'default' })
    }
}
```

#### Event-Driven Pattern

GameInput supports method chaining for event handlers:

```javascript
const gameInput = new GameInput()
    .onReinitialize(() => {
        console.log('Players updated')
    })
    .onButtonDown((playerIndex, sectionName, buttonName) => {
        console.log('Button pressed')
    })
    .onButtonUp((playerIndex, sectionName, buttonName) => {
        console.log('Button released')
    })
```

#### Game Loop Pattern

```javascript
const gameInput = new GameInput()

function gameLoop() {
    for (const player of gameInput.Players) {
        if (!player) continue

        // Check button state
        if (player.state.face.ordinal(0)) {
            // Primary button pressed
        }

        // Get analog stick vector
        const leftStick = player.getStickVector('left')
        // Use leftStick.x and leftStick.y
    }
    requestAnimationFrame(gameLoop)
}
```

## Quality Tools and Practices

### ESLint Configuration

The project extends `eslint-config-standard` with additional plugins:

* **editorconfig**: Enforces EditorConfig rules
* **jsdoc**: Validates JSDoc comments

**Notable Rules**:
- `max-len: 0` - No line length limit
- `curly: 0` - Curly braces optional for single-line blocks
- `jsdoc/check-types: 0` - JSDoc type checking disabled (TypeScript does this)

**Always run `npm run lint` before committing.**

### Testing with Jest

Tests use Jest with jsdom to simulate browser environment:

```javascript
import { describe, it, expect } from '@jest/globals'
import { MyClass } from './my-class.js'

describe('MyClass', () => {
    describe('methodName', () => {
        it('should do something specific', () => {
            const instance = new MyClass({ value: 'test' })
            const result = instance.methodName()
            expect(result).toBe('expected')
        })

        it('should handle edge case', () => {
            const instance = new MyClass({ value: '' })
            expect(() => instance.methodName()).toThrow()
        })
    })
})
```

**Test File Conventions**:
- Name: `<source-file>.test.js` (co-located with source)
- Structure: Nested `describe` blocks for organization
- Assertions: Use Jest's `expect()` API

**Current Test Coverage**:
The following modules have tests:
- `combined-axis-as-button.test.js`
- `gameinput-model.test.js`
- `gamepad-mapping.test.js`
- `vendor-theme-matching.test.js`

### EditorConfig

The `.editorconfig` file enforces:
- **4 spaces** for JavaScript/HTML/CSS
- **2 spaces** for YAML files
- **UTF-8** encoding
- **LF** line endings (except .bat files)
- **Trim trailing whitespace**
- **Insert final newline**

## Architectural Patterns

### Gamepad Model Detection

The library uses a multi-tier matching system:

1. **Specific Models**: Exact gamepad ID matches (highest priority)
2. **Vendor Themes**: Match by USB vendor ID (e.g., 057e → Nintendo)
3. **Generic Patterns**: Fallback patterns (e.g., "STANDARD GAMEPAD")
4. **Unknown**: Default to standard mapping with generic icons

### Button Schema System

Three main schemas define button naming conventions:

- **Hedgehog**: Xbox style (A, B, X, Y)
- **Plumber**: Nintendo style (B, A, Y, X)
- **Xross**: PlayStation style (Cross, Circle, Square, Triangle)

Button sections:
- `face`: Primary action buttons
- `shoulder`: L1/R1, LB/RB
- `trigger`: L2/R2, LT/RT
- `stick`: L3/R3, LS/RS
- `center`: Start, Select, Menu, View
- `dpad`: Directional pad

### State Management

Each player has:
- **Current State**: Current button/axis values
- **Previous State**: Previous frame's values
- **Event Callbacks**: Triggered on state changes

## Common Patterns and Conventions

### Gamepad ID Parsing

Gamepad IDs come in different formats across browsers:

```javascript
// Firefox: "VID-PID-Name"
'057e-2009-Nintendo Switch Pro Controller'

// Chrome: "Name (Vendor: VID Product: PID)"
'Nintendo Switch Pro Controller (Vendor: 057e Product: 2009)'

// Chrome with standard mapping: "Name (STANDARD GAMEPAD Vendor: VID Product: PID)"
'Nintendo Switch Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)'
```

The library parses all formats using regex in `GameInputModel`.

### Axis to Button Conversion

Analog axes can be treated as digital buttons:

```javascript
// Single axis as button (e.g., trigger)
const triggerButton = new AxisAsButton(2, 0.5, true)

// Combined axes as button (e.g., stick click direction)
const stickUp = new CombinedAxisToButton(
    [[1, -0.5, false]], // Y-axis negative
    'AND'
)
```

### Vector2 for Joystick

Joystick positions use Vector2:

```javascript
const leftStick = player.getStickVector('left')
console.log(leftStick.x, leftStick.y) // Range: -1.0 to 1.0
console.log(leftStick.magnitude)      // Distance from center
console.log(leftStick.angle)          // Angle in radians
```

## Boundaries and Guardrails

* **NEVER** add runtime dependencies. This is a core design principle.
* **NEVER** add a build step that transforms the source code (no Babel, no TypeScript compilation).
* **NEVER** remove or modify JSDoc comments - they are the type system.
* **NEVER** disable linter warnings without proper justification in code review.
* **ALWAYS** maintain backward compatibility with existing API.
* **ALWAYS** test in multiple browsers when changing core gamepad detection logic.
* **ASK FIRST** before adding new gamepad models to the database.
* **ASK FIRST** before changing the button schema system.

## Working with Gamepad Hardware

### Adding New Gamepad Models

When adding a new gamepad to `gameinput-models.js`:

1. **Test in Multiple Browsers**: Chrome, Firefox, Safari, Edge
2. **Capture Gamepad ID**: Use `navigator.getGamepads()` to get exact ID string
3. **Determine Mapping**: Test which physical button maps to which index
4. **Choose Schema**: Hedgehog (Xbox), Plumber (Nintendo), or Xross (PlayStation)
5. **Find Icon**: Add icon to `/img/` if needed (or use generic)
6. **Add Entry**: Add new `GameInputModel` with correct parameters

Example:
```javascript
new GameInputModel(
    GameInputSchema.Hedgehog,  // Button naming scheme
    'xboxone',                  // Icon name (from /img/)
    '045e-02ea-Xbox One Controller' // Exact gamepad ID string
)
```

### Testing Gamepad Changes

```bash
# Run unit tests
npm test

# Run demo locally to test with real hardware
npm run serve
# Visit http://localhost:3000 and connect gamepad
```

## Common Pitfalls to Avoid

* **Forgetting JSDoc**: All public methods/properties need JSDoc comments
* **Breaking ES Module imports**: Always use `.js` extension in imports
* **Adding dependencies**: This project has zero runtime dependencies by design
* **Ignoring browser differences**: Gamepad API varies between browsers
* **Hardcoding button indices**: Use schema names, not raw indices
* **Not testing with hardware**: Gamepad detection requires real hardware testing
* **Inconsistent indentation**: Use 4 spaces (enforced by EditorConfig)
* **Removing type information**: JSDoc is the only type system - don't delete it

## Priority Areas for Contributions

1. **More Gamepad Models**: Add support for additional gamepad hardware
2. **Cross-Browser Testing**: Verify compatibility in Safari, Firefox, Edge
3. **Test Coverage**: Add tests for modules without coverage
4. **Documentation**: Improve JSDoc comments and examples
5. **Demo Improvements**: Enhance the demo with more examples
6. **Icon Library**: Add icons for more gamepad models

## Domain-Specific Knowledge

### Gamepad API Basics

The browser Gamepad API provides:
- `navigator.getGamepads()`: Array of connected gamepads
- `gamepadconnected` event: Fired when gamepad connects
- `gamepaddisconnected` event: Fired when gamepad disconnects

Each gamepad object has:
- `id`: String identifying the gamepad
- `buttons`: Array of button objects with `pressed` and `value`
- `axes`: Array of axis values (-1.0 to 1.0)
- `mapping`: "standard" or "" (browser determines if using standard mapping)
- `timestamp`: Last time gamepad data was updated

### Standard Gamepad Layout

The W3C Standard Gamepad layout defines:
- **Buttons 0-3**: Face buttons (bottom, right, left, top)
- **Buttons 4-5**: Shoulder buttons (L1/LB, R1/RB)
- **Buttons 6-7**: Triggers (L2/LT, R2/RT)
- **Buttons 8-9**: Select/Start
- **Buttons 10-11**: Stick clicks (L3/LS, R3/RS)
- **Buttons 12-15**: D-pad (up, down, left, right)
- **Button 16**: Home/Guide (optional)

- **Axes 0-1**: Left stick (X, Y)
- **Axes 2-3**: Right stick (X, Y)

### Vendor Differences

**Nintendo** (Plumber schema):
- Swaps A/B and X/Y compared to Xbox
- Switch Pro Controller has NFC, gyro, HD rumble

**PlayStation** (Xross schema):
- Uses symbols instead of letters (Cross, Circle, Square, Triangle)
- Different shoulder button feel (L1/L2/R1/R2)
- Touchpad on DualShock 4 / DualSense

**Xbox** (Hedgehog schema):
- Original standard that most games follow
- XInput on Windows provides consistent mapping
- Multiple generations (360, One, Series)

## Resources

* **Project Homepage**: https://github.com/lunarcloud/gameinputjs
* **NPM Package**: https://www.npmjs.com/package/gameinputjs
* **Demo**: Available in `/demo/` directory
* **W3C Gamepad API**: https://www.w3.org/TR/gamepad/
* **MDN Gamepad API**: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API

## Questions or Unclear Requirements?

If you encounter ambiguity or need clarification:

1. Check existing code patterns for similar functionality
2. Review JSDoc comments in related modules
3. Check CONTRIBUTING.md for coding conventions
4. Run tests to understand expected behavior
5. Ask the project maintainer if still unclear

The project maintainer (Samuel Sarette / lunarcloud) is the final authority on design decisions.
