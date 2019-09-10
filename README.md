<h1 align="center">🛳 Ship.js</h1>

<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/v/shipjs">

  <a href="https://github.com/algolia/shipjs/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/algolia/shipjs">
  </a>
</p>

<p align="center">
  Take control of what is going to be your next release.
</p>

## Why 🤷🏻‍

Coding is fun, debugging and testing are okay, but releasing is NOT.

When releasing, you normally do the following:

- Update the version in `package.json`
- `yarn build && yarn publish`
- Update the changelog
- Create a git tag

### What can go wrong?

- Environments are different across your team members.
- Manually figuring out the next version may lead to a potential mistake.
- The whole process happens on your local machine.
  - You're releasing alone.
  - You cannot do other tasks until it's done.

## How❓

In Ship.js, the release process consists of three parts.

### Part 1. Preparation (`shipjs prepare`)

![Preview](preview.gif)

- Figure out next version.
- Update the version and changelog.
- Create a pull request.

This is done by running `shipjs prepare` on your terminal. It takes less than a minute.

### Part 2. Review

- Review the PR by yourself, or with your colleagues.
- Add more commits to the PR if you want.

When you think it's ready to ship, merge the PR.

### Part 3. Trigger a release (`shipjs trigger`)

- Run a final test (unit, e2e, etc).
- Release it to NPM.
- Create a git tag for the version.

This is done by running `shipjs trigger` on your terminal.

You can configure your CI service to run this on behalf of you. It will run automatically as soon as the PR is merged. It means the longest process is done somewhere else, not occupying your working environment.

## How, again⁉️

Let's assume the following situation:

- Current branch: `master`
- Currently released version: `1.0.0`
- Next version: `1.0.1` (because there are only commits like chore, fix, ...)

### Part 1. Preparation (`shipjs prepare`)

On your terminal, run `shipjs prepare` and it will briefly do the following:

- `git checkout -b releases/v1.0.1`
- Update the version in `package.json`.
- Update the changelog.
- `git commit -m "chore: release v1.0.1`
- Create a PR from `releases/v1.0.1` to `master`.

You can run `shipjs prepare --dry-run` just to see what will be executed without actual execution.

### Part 2. Review

You will review and merge this PR.

If you added more commits to this PR, you need to `Squash and merge` so that the latest commit message can be `chore: release v1.0.1`. This is required for the next step.

### Part 3. Trigger a release (`shipjs trigger`)

On your terminal, `git pull` on `master` branch. And run `shipjs trigger`. It will check the following conditions whether it should proceed releasing or not.

- if it's `master` branch now
- if the latest commit message is `chore: releases v1.0.1`

If the conditions are met, `shipjs trigger` will briefly do the following:

- Send a Slack message to notify the beginning of the release(If configured).
- Run test, build and publish it to NPM.
- `git tag v1.0.1`
- Push them and notify at Slack.

You can run `shipjs trigger --dry-run` just to see what will be executed without actual execution.

And you can configure your CI service to run the Part 3 on behalf of you.

## Installation

```bash
npm install --save-dev shipjs

or

yarn add -D shipjs
```

Add the following to the `scripts` section in your `package.json`.

```js
"release:prepare": "shipjs prepare",
"release:trigger": "shipjs trigger",
```

Do you want to set it up now? Then, let's move on to the [GUIDE.md](./GUIDE.md).

## How is it different from semantic-release?

**semantic-release** is a tool for `fully automated version management and package publishing`.

Ship.js provides a half automation, which gives you a chance to:

- Confirm the semantically bumped version is actually correct
- Check which commits are going to be released and discuss with colleagues
- Check the automatically generated changelog and refine it
- Put the release aside for a second, build a test package for the PR and test it in another environments(Possibly [Pika CI](https://github.com/apps/pika-ci) can be used here).

## Contributing

You can create an issue for bug, feature request or your opinion.

And we also appreciate your PRs. The detailed contribution guide is coming soon.

## Getting Started

Let's move on to the [GUIDE.md](./GUIDE.md).
