#!/bin/bash
rm -r dist
mkdir dist
npx uglifyjs --compress  --module --source-map --comments -o dist/gameinput.js  -- gameinput.js
npx uglifyjs --compress  --module --source-map --comments -o dist/gameinput.models.js  -- gameinput.models.js
npx uglifyjs --compress  --module --source-map --comments -o dist/gameinput.types.js  -- gameinput.types.js
npx uglifyjs --compress  --module --source-map --comments -o dist/gameinput.dom.js  -- gameinput.dom.js

