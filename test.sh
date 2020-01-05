#!/bin/sh

./node_modules/.bin/mocha ${@} \
  --recursive \
  'src/**/*.spec.js'
