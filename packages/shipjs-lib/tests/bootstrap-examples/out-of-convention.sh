#!/usr/bin/env bash

./tests/bootstrap-examples/empty.sh out-of-convention && \
(
  cd sandbox/out-of-convention && \
  git add . && git commit -m "initial commit" && \
  git tag v0.0.1 && \
  touch a && \
  git add a && git commit -m "hello: add a"
)