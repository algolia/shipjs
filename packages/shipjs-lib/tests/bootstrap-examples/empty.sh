#!/usr/bin/env bash

PROJECT_NAME=$1 && \
rm -rf sandbox/$PROJECT_NAME && \
mkdir -p sandbox/$PROJECT_NAME && \
WORKING_DIRECTORY=`pwd` && \
cd sandbox/$PROJECT_NAME && \
git init -b master && \
git config user.email "shipjs@test.com" && \
git config user.name "shipjs" && \
(
cat > package.json <<EOF
{
  "name": "$PROJECT_NAME",
  "version": "0.0.0",
  "scripts": {
    "test": "echo 'Error: no test specified' && exit 1"
  }
}
EOF
) && \
npx json -I -f package.json -e 'this.version = "0.0.1"' && \
cd $WORKING_DIRECTORY
