# Contributing to GameInputJS

Thank you for your interest in contributing to GameInputJS! This project is primarily maintained by one developer, but I've made it open-source for two reasons:
* So that others may learn and use the techniques employed here
* To enable community contributions for features, fixes, and especially new gamepad mappings

This guide will help you contribute effectively, especially if you want to add support for a new gamepad model.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Adding a New Gamepad Mapping](#adding-a-new-gamepad-mapping)
- [Code Style and Conventions](#code-style-and-conventions)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code of Conduct](#code-of-conduct)

## Getting Started

### Prerequisites
- **Node.js**: >= 24.13.0
- **npm**: >= 11.0.0
- One or more gamepads

### Fork and Clone

Fork the repository on GitHub and clone it locally.

### Install Dependencies

```bash
npm install
```

### Verify Your Setup

```bash
# Run linter
npm run lint

# Run tests
npm test

# Build the project
npm run build

# Serve demo locally
npm run serve
```

If everything passes, you're ready to start developing!

## Development Workflow

### Typical Workflow

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Run linter and fix issues:
   ```bash
   npm run lint-fix
   ```

4. Run tests:
   ```bash
   npm test
   ```

5. Test your changes locally:
   ```bash
   npm run serve
   # Visit http://localhost:3000 with your gamepad
   ```

6. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

7. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

8. Open a Pull Request on GitHub

## Adding a New Gamepad Mapping

One of the most valuable contributions is adding support for new gamepad models! Here's how:

### Step 1: Gather Information

Connect your gamepad and open the browser console:

```javascript
// Get your gamepad's information
const gamepad = navigator.getGamepads()[0]
console.log('ID:', gamepad.id)
console.log('Mapping:', gamepad.mapping)
console.log('Buttons:', gamepad.buttons.length)
console.log('Axes:', gamepad.axes.length)
```

**Example output:**
```
ID: "057e-2009-Nintendo Switch Pro Controller"
    ^^^^ ^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    VID  PID  Name
```

**What you need:**
1. **Vendor ID (VID)**: First 4 hex digits (e.g., `057e`)
2. **Product ID (PID)**: Next 4 hex digits (e.g., `2009`)
3. **Device Name**: The text after the IDs
4. **Operating System**: Windows, Linux, macOS, etc.
5. **Browser**: Chrome, Firefox, Safari, Edge

### Step 2: Map the Buttons and Axes

Use one of the many online gamepad testers (such as [Gamepad Tester](https://gamepad-tester.com/) or [HTML5 Gamepad Tester](https://html5gamepad.com/)) to identify each button and axis.

**Test each input and record:**
- Face buttons (A/B/X/Y or Cross/Circle/Square/Triangle)
- D-pad (up, down, left, right)
- Shoulder buttons (L1/LB, R1/RB)
- Triggers (L2/LT, R2/RT) - note if analog or digital
- Analog sticks (left/right, X/Y axes, and click buttons)
- Center buttons (Start, Select, Menu, View, Home)

### Step 3: Determine the Button Schema

GameInputJS uses three primary button naming schemes:

| Schema | Style | Primary Button Names | Used By |
|--------|-------|---------------------|---------|
| **Hedgehog** | Xbox | A, B, X, Y | Xbox controllers |
| **Plumber** | Nintendo | B, A, Y, X | Nintendo controllers |
| **Xross** | PlayStation | Cross, Circle, Square, Triangle | PlayStation controllers |

Choose the schema that matches your gamepad's button layout.

### Step 4: Add to gameinput-models.js

Open `/src/gameinput-models.js` and add your gamepad to the `GameInputModels` array:

```javascript
new GameInputModel(
    GameInputSchema.Hedgehog,  // Choose: Hedgehog, Plumber, or Xross
    'generic',                  // Icon name (see /img/ folder or use 'generic')
    '057e-2009-Nintendo Switch Pro Controller', // Exact ID from Step 1
    'Linux',                    // Operating System (or undefined for all)
    StandardGamepadMapping      // Use StandardGamepadMapping if standard layout
)
```

**If the button mapping is non-standard**, you'll need to create a custom mapping:

```javascript
new GameInputModel(
    GameInputSchema.Hedgehog,
    'generic',
    'Custom Gamepad ID',
    'Windows',
    StandardGamepadMapping.variant({
        face: new GamepadFaceMapping(0, 1, 2, 3),    // bottom, right, left, top
        dpad: new GamepadDirectionsMapping(12, 13, 14, 15), // up, down, left, right
        shoulder: new GamepadLRMapping(4, 5),         // left, right
        trigger: new GamepadLRMapping(6, 7),          // left, right
        leftStick: new GamepadAnalogStickMapping(0, 1, 10),  // xAxis, yAxis, button
        rightStick: new GamepadAnalogStickMapping(2, 3, 11), // xAxis, yAxis, button
        center: new GamepadCenterMapping(8, 9)        // select, start
    })
)
```

**For analog triggers as axes**, use `AxisAsButton`:

```javascript
trigger: new GamepadLRMapping(
    new AxisAsButton('+', 2),  // Left trigger on axis 2 (positive direction)
    new AxisAsButton('+', 5)   // Right trigger on axis 5 (positive direction)
)
```

### Step 5: Choose or Add an Icon

Check the `/img/` directory for existing icons:
- `generic.png` - Generic gamepad
- `xbox360.png`, `xboxone.png` - Xbox controllers
- `ds3.png`, `ds4.png`, `ds5.png` - PlayStation controllers
- `snes.png`, `n64.png`, `joycons.png` - Nintendo controllers
- And more...

If you have a unique icon for your gamepad, you can add it to `/img/` and reference it in your `GameInputModel`. **Icons must be human-created and never AI-generated.**

### Step 6: Test Your Mapping

1. Build and serve the demo:
   ```bash
   npm run serve
   ```

2. Visit http://localhost:3000 and connect your gamepad

3. Verify:
   - All buttons register correctly
   - D-pad works in all directions
   - Both analog sticks work (including clicks)
   - Triggers respond correctly
   - The correct icon appears

4. Test in multiple browsers if possible (Chrome, Firefox, Safari, Edge)

### Step 7: Add Tests (Optional but Appreciated)

If you're comfortable with Jest, consider adding a test to verify your mapping:

```javascript
// In src/gameinput-models.test.js or similar
describe('Custom Gamepad Model', () => {
    it('should match the correct gamepad ID', () => {
        const model = GameInputModels.find(m => 
            m.id === 'Your-Gamepad-ID'
        )
        expect(model).toBeDefined()
        expect(model.schema).toBe(GameInputSchema.Hedgehog)
        expect(model.iconName).toBe('generic')
    })
})
```

## Code Style and Conventions

### General Guidelines

- **Module System**: Use ES modules (`import`/`export`) exclusively
- **Indentation**: 4 spaces (enforced by EditorConfig)
- **Quotes**: Single quotes for strings
- **Semicolons**: Not used (enforced by eslint-config-standard)
- **Line Endings**: LF (Unix style)
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **File Names**: kebab-case with `.js` extension

### JSDoc Requirements

**All public APIs must have JSDoc comments.** This project uses JSDoc as its type system instead of TypeScript.

#### Function Documentation

```javascript
/**
 * Brief description of the function
 * @param {string} name - Parameter description
 * @param {number} [optional] - Optional parameter (note the brackets)
 * @returns {boolean} Return value description
 * @throws {Error} When invalid input provided
 */
function exampleFunction(name, optional) {
    // implementation
}
```

#### Class Documentation

```javascript
/**
 * Example class description
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
        this.propertyName = options.name
    }

    /**
     * Method description
     * @param {number} value - Input value
     * @returns {number} Processed value
     */
    methodName(value) {
        return value * 2
    }
}
```

### ESLint

- Run `npm run lint` before committing
- Run `npm run lint-fix` to auto-fix most issues
- The project extends `eslint-config-standard`
- Don't disable linter warnings without good reason

### EditorConfig

The `.editorconfig` file enforces formatting rules:
- 4 spaces for JavaScript/HTML/CSS
- 2 spaces for YAML
- UTF-8 encoding
- LF line endings
- Trim trailing whitespace
- Insert final newline

Make sure your editor supports EditorConfig.

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

### Testing Protocol

#### For Gamepad Mappings

When adding a new gamepad, manually test:

- [ ] All face buttons (A/B/X/Y or equivalent)
- [ ] D-pad in all four directions
- [ ] Both analog sticks (X/Y movement)
- [ ] Both stick clicks (L3/R3 or LS/RS)
- [ ] Shoulder buttons (L1/R1 or LB/RB)
- [ ] Triggers (L2/R2 or LT/RT)
- [ ] Center buttons (Start, Select, Menu, View, Home)
- [ ] Rumble/vibration if supported
- [ ] Test in Chrome
- [ ] Test in Firefox (optional but recommended)

#### For Code Changes

- [ ] Add unit tests for new features
- [ ] Run full test suite: `npm test`
- [ ] Ensure tests pass in CI
- [ ] Update JSDoc if API changed
- [ ] Run `npm run type-check` to verify JSDoc types
- [ ] Test in multiple browsers if affecting core gamepad logic

### Writing Tests

Tests use Jest with jsdom environment. Follow existing patterns:

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

## Submitting Changes

### Before Submitting a Pull Request

- [ ] Run `npm run lint-fix` and fix any remaining issues
- [ ] Run `npm test` - all tests must pass
- [ ] Test your changes in the demo (`npm run serve`)
- [ ] For gamepad mappings: test on real hardware
- [ ] Update JSDoc if you changed any public APIs
- [ ] Update documentation if needed
- [ ] Commit with a clear, descriptive message
- [ ] Reference any related issue numbers

### Pull Request Process

1. **Solve an open issue** (ideally) - check the [issue tracker](https://github.com/lunarcloud/gameinputjs/issues)

2. **Keep PRs focused** - one feature or fix per PR

3. **Write a clear description**:
   - What does this PR do?
   - How was it tested?
   - Any breaking changes?
   - Screenshots/videos if UI-related

4. **Use the PR template** - fill out all sections

5. **Be patient** - the maintainer will review when available

6. **Respond to feedback** - address review comments promptly

7. **Final decision** - the maintainer reserves the right to accept or reject any PR

### Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- First line is a brief summary (50 chars or less)
- Reference issues and PRs when relevant
- For gamepad mappings: include controller name

**Examples:**
```
Add support for Xbox Elite Controller Series 2
Fix D-pad mapping on Nintendo Switch Pro Controller
Update JSDoc for GameInput constructor options
```

## Architectural Principles

### Core Design Principles

1. **Zero Runtime Dependencies** - This project has no runtime dependencies by design. All functionality is self-contained.

2. **No Build Transformation** - Source files are distributed as-is (ES modules). No Babel, no TypeScript compilation.

3. **Browser-Only** - This is a client-side library. No Node.js runtime code.

4. **Backward Compatibility** - Maintain backward compatibility with existing APIs.

### Boundaries and Guardrails

**NEVER:**
- Add runtime dependencies
- Add build steps that transform source code
- Remove or modify JSDoc comments without updating them
- Break backward compatibility without discussion
- Disable linter warnings without justification

**ALWAYS:**
- Use ES modules with `.js` extensions in imports
- Maintain JSDoc for all public APIs
- Test with real hardware for gamepad changes
- Run linter and tests before committing

**ASK FIRST:**
- Before adding new gamepad models (or submit a PR)
- Before changing the button schema system
- Before making breaking changes

## Code of Conduct

### Expected Behavior

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what's best for the project
- Accept constructive criticism gracefully
- Use a neutral, objective tone in code and comments

### Unacceptable Behavior

- Harassment or discrimination of any kind
- Trolling, insulting, or derogatory comments
- Publishing others' private information
- Other conduct inappropriate in a professional setting

### Enforcement

The project maintainer has the final say on all contributions and conduct issues. Inappropriate behavior may result in removal from the project community.

## Questions or Need Help?

- **Bug reports**: [Open an issue](https://github.com/lunarcloud/gameinputjs/issues/new?template=bug_report.md)
- **Feature requests**: [Open an issue](https://github.com/lunarcloud/gameinputjs/issues/new?template=feature_request.md)
- **Questions**: Check existing issues or open a new one
- **Gamepad testing help**: Include your gamepad ID and browser info in your issue

## Additional Resources

- [README.md](README.md) - Project overview and usage
- [W3C Gamepad API Spec](https://www.w3.org/TR/gamepad/)
- [MDN Gamepad API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API)
- [Project Demo](demo/) - Example usage

---

Thank you for contributing to GameInputJS! 🎮

**- Sam (Project Maintainer)**
