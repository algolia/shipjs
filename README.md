<h1 align="center">🛳 Ship.js</h1>

<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/v/shipjs">

  <a href="https://github.com/algolia/shipjs/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/algolia/shipjs">
  </a>
</p>

<p align="center">
  Ship.js helps you with a better release process.
</p>

## Why 🤷🏻‍

Coding is fun, debugging and testing are okay, but releasing is NOT.

When releasing, you normally do the following:

- Update the version in `package.json`
- `yarn build && yarn publish`
- Update the changelog
- Create a git tag

### What can go wrong?

- Different environment across members.
- Potential mistake by figuring out the next version manually.
- The whole process happening on your local machine.
  - You're releasing alone.
  - It occupies your time.

## How❓

In Ship.js, the release process consists of three parts.

### 1. Preparation

- Figure out next version.
- Update the version and changelog.
- Create a pull-request.

This is done with a command `shipjs prepare`. It takes less than a minute.

### 2. Review

- Review the pull-request by yourself, or with your colleagues.
- Add more commits to the pull-request if you want any.

When you think it's ready to ship, merge the pull-request.

### 3. Actual Release

- Run a final test (unit, e2e, etc).
- Release it to NPM.
- Create a git tag for the version.

This is done with a command `shipjs release`.

You will probably configure this to run on your CI. It means the longest process is done somewhere else, not occupying your working environment.

## How, again⁉️

Let's assume the following situation:

- Current branch: `master`
- Currently released version: `1.0.0`
- Next version: `1.0.1` (because there are only commits like chore, fix, ...)

### 1. Preparation

Running `shipjs prepare` will briefly do the following:

- `git checkout -b releases/v1.0.1`
- Update the version in `package.json`.
- Update the changelog.
- `git commit -m "chore: releases v1.0.1`
- Create a pull-request from `releases/v1.0.1` to `master`.

### 2. Review

You will review and merge this pull-request.

If you added more commits to this pull-request, you need to `Squash & merge` for next step.

### 3. Actual Release

- Your CI service will be triggered because there is a new commit in `master` branch, which is `chore: releases v1.0.1`.
- You already have configured your CI to run `shipjs release` on `master` branch.
- `shipjs release` knows the latest commit is for release, so it continues.
- Send a slack message to notify the beginning of the release.
- Run test, build and release it to NPM.
- `git tag v1.0.1`
- Push them and notify via Slack.

## Installation

```bash
npm install --save-dev shipjs

or

yarn add -D shipjs
```

Add the following to the `scripts` section in your `package.json`.

```js
"shipjs:prepare": "shipjs prepare",
"shipjs:release": "shipjs release",
```

Do you want to set it up now? Then, let's move on to the [guide](./GUIDE.md).

## How is it different from semantic-release?

**semantic-release** is a tool for `fully automated version management and package publishing`.

Ship.js provides a half automation, which gives you a chance to:

- Confirm the next version which is semantically bumped
- Check which commits are going to be released
- Modify the changelog before release
- Postpone the release, build a test package for the PR and test it ([Pika CI](https://github.com/apps/pika-ci) can be used here)

## Is Ship.js opinionated?

Ship.js works with zero configuration out of box, but also lets you configure as much as you want.

## Contributing

You can create an issue for bug, feature request or your opinion.

And we also appreciate your PRs. The detailed contribution guide is coming soon.

## Getting Started

Let's move on to the [guide](./GUIDE.md).
