#!/usr/bin/env bash

./tests/bootstrap-examples/empty.sh currently-master-branch && \
(
  cd sandbox/currently-master-branch && \
  git add . && git commit -m "initial commit"
)