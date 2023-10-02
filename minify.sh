#!/bin/bash
rm -r dist
mkdir dist
npx uglifyjs --compress  --module --source-map --comments -o dist/gameinput.min.js  -- gameinput.js
npx uglifyjs --compress  --module --source-map --comments -o dist/gameinput.models.min.js  -- gameinput.models.js
npx uglifyjs --compress  --module --source-map --comments -o dist/gameinput.custom.min.js  -- gameinput.custom.js
npx uglifyjs --compress  --module --source-map --comments -o dist/gameinput.dom.min.js  -- gameinput.dom.js
cp tester.html dist/
