#!/usr/bin/env bash

./tests/bootstrap-examples/empty.sh with-tag && \
(
  cd sandbox/with-tag && \
  git add . && git commit -m "initial commit" && \
  git tag v0.0.1
)