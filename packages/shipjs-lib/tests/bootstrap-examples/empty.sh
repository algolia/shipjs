#!/usr/bin/env bash

PROJECT_NAME=$1 && \
rm -rf sandbox/$PROJECT_NAME && \
mkdir -p sandbox/$PROJECT_NAME && \
WORKING_DIRECTORY=`pwd` && \
cd sandbox/$PROJECT_NAME && \
npm init -y && \
replace-in-file '/"version": ".*"/' '"version": "0.0.1"' package.json --isRegex && \
git init && \
cd $WORKING_DIRECTORY