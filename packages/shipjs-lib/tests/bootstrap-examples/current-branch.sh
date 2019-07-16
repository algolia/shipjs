#!/usr/bin/env bash

./tests/bootstrap-examples/empty.sh current-branch && \
(
  cd sandbox/current-branch && \
  git add . && git commit -m "initial commit"
)