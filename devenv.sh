#!/bin/sh

docker run \
  --rm \
  -it \
  -v $(pwd):/app \
  -w /app \
  -p 8080:8080 \
  node:12.14.0 /bin/bash
