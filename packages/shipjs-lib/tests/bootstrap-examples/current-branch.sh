#!/usr/bin/env bash

ls -al
./tests/bootstrap-examples/empty.sh current-branch && \
(
  ls -al && \
  cd sandbox/current-branch && \
  git add . && git commit -m "initial commit"
)