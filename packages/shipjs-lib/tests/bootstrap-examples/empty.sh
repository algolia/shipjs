#!/usr/bin/env bash

PROJECT_NAME=$1 && \
rm -rf sandbox/$PROJECT_NAME && \
mkdir -p sandbox/$PROJECT_NAME && \
WORKING_DIRECTORY=`pwd` && \
cd sandbox/$PROJECT_NAME && \
npm init -y && \
npm version 0.0.1 --allow-same-version && \
git config --global user.email "shipjs@test.com" && \
git config --global user.name "shipjs" && \
git init && \
cd $WORKING_DIRECTORY