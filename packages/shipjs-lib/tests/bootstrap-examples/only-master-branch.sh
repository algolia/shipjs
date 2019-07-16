#!/usr/bin/env bash

./tests/bootstrap-examples/empty.sh only-master-branch && \
(
  cd sandbox/only-master-branch && \
  git add . && git commit -m "initial commit"
)