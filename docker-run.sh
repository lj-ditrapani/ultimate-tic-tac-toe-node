#!/usr/bin/env sh

docker run --rm \
    --network=host \
    -e mode=$mode \
    -e host=$host \
    uttt
