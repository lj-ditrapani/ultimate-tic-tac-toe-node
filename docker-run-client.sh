#!/usr/bin/env sh

docker run -it --rm \
    --network=host \
    -e host=$host \
    uttt client
