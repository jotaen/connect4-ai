#!/bin/sh

rm -rf ./dist

./node_modules/.bin/parcel build \
  --public-url ./ \
  ./src/ui/web/index.html ./src/ui/web/worker.js
