#!/bin/bash

#npm install uglify-js -g

uglifyjs --compress --screw-ie8 --source-map --comments -o gameinput.min.js  -- gameinput.js
uglifyjs --compress --screw-ie8 --source-map --comments -o gameinput.models.min.js  -- gameinput.models.js


uglifyjs --compress --screw-ie8 --source-map --comments -o gameinput.custom.min.js  -- gameinput.custom.js
uglifyjs --compress --screw-ie8 --source-map --comments -o gameinput.dom.min.js  -- gameinput.dom.js
