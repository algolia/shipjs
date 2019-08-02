#!/usr/bin/env bash
set -e

REPO_NAME="$1"

if [ -z "$REPO_NAME" ]; then
  echo "usage: "
  echo "  yarn bootstrap <NEW_REPO_NAME>"
  exit 1
fi

if [ -d "../$REPO_NAME" ]; then
  echo "It already exists: ../$REPO_NAME"
  exit 1
fi

mkdir -p ../$REPO_NAME
cd ../$REPO_NAME
git init
touch README.md
git add README.md
git commit -m "chore: add README.md"

echo "node_modules" > .gitignore
git add .gitignore
git commit -m "chore: add .gitignore"

npm init -y
npx json -I -f package.json -e 'this.version = "0.0.1"'
git add package.json
git commit -m "chore: version 0.0.1"
git tag v0.0.1

touch abc
git add abc
git commit -m "feat(abc): add abc"

echo "abc" > abc
git add abc
git commit -m "fix(abc): fix a bug"

yarn add shipjs -D
npx json -I -f package.json -e 'this.scripts["release:prepare"] = "shipjs prepare"'
npx json -I -f package.json -e 'this.scripts["release"] = "shipjs release"'
git add .
git commit -m "chore: add shipjs"

hub create -p -o $REPO_NAME
git push --set-upstream origin master --tags

echo ""
echo ""
echo "All is ready. Try the following:"
echo ""
echo "  $ cd ../$REPO_NAME"
echo "  $ yarn release:prepare"
echo ""
echo "It will open a pull-request."
echo "Review and merge it."
echo "After that, run 'git pull && yarn release' will release it to npm."
echo "Check out the package.json."
echo ""
echo "  $ cat package.json"
echo ""
echo ""