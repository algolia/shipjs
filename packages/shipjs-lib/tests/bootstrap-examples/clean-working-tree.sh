#!/usr/bin/env bash

./tests/bootstrap-examples/empty.sh clean-working-tree && \
(
  cd sandbox/clean-working-tree && \
  git add . && git commit -m "initial commit"
)