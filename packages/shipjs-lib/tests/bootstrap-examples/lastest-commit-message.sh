#!/usr/bin/env bash

./tests/bootstrap-examples/empty.sh lastest-commit-message && \
(
  cd sandbox/lastest-commit-message && \
  git add . && git commit -m "this is a lastest commit message"
)