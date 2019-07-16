#!/usr/bin/env bash

./tests/bootstrap-examples/empty.sh patch-version-up && \
(
  cd sandbox/patch-version-up && \
  git add . && git commit -m "initial commit" && \
  git tag v0.0.1 && \
  touch a && \
  git add a && git commit -m "chore: add a"
)