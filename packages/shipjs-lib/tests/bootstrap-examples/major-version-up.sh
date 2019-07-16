#!/usr/bin/env bash

./tests/bootstrap-examples/empty.sh major-version-up && \
(
  cd sandbox/major-version-up && \
  git add . && git commit -m "initial commit" && \
  git tag v0.0.1 && \
  touch a && \
  git add a && git commit -m "feat: add a" -m "BREAKING CHANGE: this breaks the previous behavior."
)