#!/usr/bin/env sh

docker run --rm \
    --network=host \
    -e host=$host \
    uttt $1
