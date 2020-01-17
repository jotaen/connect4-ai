#!/bin/sh

rm -rf ./dist

./node_modules/.bin/parcel serve \
  --port 8080 \
  --no-hmr \
  ./src/ui/web/index.html ./src/ui/web/worker.js
