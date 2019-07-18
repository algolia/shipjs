#!/usr/bin/env bash

PROJECT_NAME=$1 && \
rm -rf sandbox/$PROJECT_NAME && \
mkdir -p sandbox/$PROJECT_NAME && \
WORKING_DIRECTORY=`pwd` && \
cd sandbox/$PROJECT_NAME && \
git init && \
git config user.email "shipjs@test.com" && \
git config user.name "shipjs" && \
npm init -y && \
npx json -I -f package.json -e 'this.version = "0.0.1"' && \
cd $WORKING_DIRECTORY