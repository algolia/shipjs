#!/usr/bin/env bash

./tests/bootstrap-examples/empty.sh minor-version-up && \
(
  cd sandbox/minor-version-up && \
  git add . && git commit -m "initial commit" && \
  git tag v0.0.1 && \
  touch a && \
  git add a && git commit -m "chore: add a" && \
  touch b && \
  git add b && git commit -m "feat: add b"
)