---
title: Introduction
---

<style>
.action {
  margin: 1.8rem auto;
}
.action-button {
  display: inline-block;
  font-size: 1.2rem;
  color: #fff;
  background-color: #3eaf7c;
  padding: 0.8rem 1.6rem;
  border-radius: 4px;
  -webkit-transition: background-color 0.1s ease;
  transition: background-color 0.1s ease;
  box-sizing: border-box;
  border-bottom: 1px solid #389d70;
}
</style>

# Introduction

## Why 🤷🏻‍

Coding is fun, debugging and testing are okay, but releasing is NOT.

When releasing, you go through something like the following:

- Update the version in `package.json`
- Update the changelog
- Actually release it (e.g. `npm run build && npm publish`)
- Create a git tag
- Create a release on GitHub

### What could go wrong?

- You might make mistakes during the release.
  - Environments are different across your team members.
  - You're releasing alone because the whole process happens on your local machine.
  - It's not your everyday-job. Mistakes can happen.
- You are blocked and cannot do anything else until it's done.
  - Even if you have a release script, you need to watch until the script finishes well.
  - You don't want to switch to another feature branch and work there until the script finishes.

## How to solve them❓

In Ship.js, the release process consists of three parts.

### Part 1. Preparation (`shipjs prepare`)

![Preview](./preview.gif)

Run `shipjs prepare` and it will briefly do the following:

- Figure out next version.
- Update the version and changelog.
- Create a pull request.

It takes less than a couple of minutes.

### Part 2. Review

- Review the PR by yourself, or with your colleagues.
- Add more commits to the PR if you want.
- You can hold the release, build from the staging branch and test it manually.
- If you want to cancel the release, just close the PR and delete the staging branch.

When you think it's ready to release, merge the PR.

### Part 3. Trigger a release (`shipjs trigger`)

Run `shipjs trigger` and it will briefly do the following:

- Run a final test (unit, e2e, etc).
- Release it to NPM (or elsewhere as you configure it).
- Create a git tag for the version.
- Create a release for the tag on GitHub.

You can manually run `shipjs trigger` on the base branch after the PR is merged.

However you can also configure your CI service(e.g. CircleCI) to do this for you. It means the longest process is on the CI service asynchronously, not occupying your working environment.

<p class="action">
  <a href="./getting-started.html" class="nav-link action-button">Get Started →</a>
</p>

## Or, a little deeper look ⁉️

Let's assume the following situation:

- Current branch: `master`
- Currently released version: `1.0.0`
- Next version: `1.0.1` (because there are only commits like `chore:`, `fix:`, ...)

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

You can add more commits to this PR if needed.

Merge the PR into a single commit by `Squash and merge`.

You can read [this](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-request-merges#squash-and-merge-your-pull-request-commits) to learn more.

### Part 3. Trigger a release (`shipjs trigger`)

On your terminal, `git pull` on `master` branch. And run `shipjs trigger`. It will check the following conditions whether it should proceed releasing or not.

- if it's `master` branch now
- if the latest commit message is like `chore: releases v1.0.1 (#xx)`

If the conditions are met, `shipjs trigger` will briefly do the following:

- Send a Slack message to notify the beginning of the release(If configured).
- Run test, build and release it.
- `git tag v1.0.1`.
- Push them to git remote.
- `hub release create -m <changelog> v1.0.1`
- Notify at Slack.

You can run `shipjs trigger --dry-run` just to see what will be executed without actual execution.

And you can configure your CI service to run the Part 3 on behalf of you. What you need to do is just to make it run `shipjs trigger` every time there is a new commit. It's okay to do so because `shipjs trigger` triggers release only when the conditions are met. If not, it skips.

<p class="action">
  <a href="./getting-started.html" class="nav-link action-button">Get Started →</a>
</p>
