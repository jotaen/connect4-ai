#!/bin/sh

./node_modules/.bin/parcel \
  --port 8080 \
  --hmr-port 8081 \
  ./src/ui/web/index.html
