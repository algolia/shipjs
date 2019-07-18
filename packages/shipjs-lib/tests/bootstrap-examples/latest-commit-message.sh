#!/usr/bin/env bash

./tests/bootstrap-examples/empty.sh latest-commit-message && \
(
  cd sandbox/latest-commit-message && \
  git add . && git commit -m "this is a latest commit message"
)