#!/usr/bin/env bash

./tests/bootstrap-examples/empty.sh simple-monorepo/ && \
./tests/bootstrap-examples/empty.sh simple-monorepo/packages/package_a && \
./tests/bootstrap-examples/empty.sh simple-monorepo/packages/package_b