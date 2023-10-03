GameInput JS
=============

A client-side javascript module one can import to add good gamepad support to web-powered games or other gamepad-powered web applications.

You'll need at minimum: 
```js
import { GameInput } from './gameinput.js'

const gameInput = new GameInput()
```

Building
---------
Build works on all platforms, simple as any other npm-powered project.
```bash
npm i
npm run build
```
Docs are built via the npm `docs` script and is also done in the `build-prod` script.

Code Style & Quality
------------------------
Editors should pick up the `jsconfig.json` and `.eslintrc.json` to automatically check code style and type-related issues.
Check the code issues with the linter via `npm run lint` or try to automatically cleanup with `npm run lint-fix`.
