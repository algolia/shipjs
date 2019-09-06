#!/usr/bin/env bash

./tests/bootstrap-examples/empty.sh monorepo-with-nonpkg-directory/ && \
./tests/bootstrap-examples/empty.sh monorepo-with-nonpkg-directory/packages/package_a && \
./tests/bootstrap-examples/empty.sh monorepo-with-nonpkg-directory/packages/package_b && \
mkdir sandbox/monorepo-with-nonpkg-directory/packages/not_a_package