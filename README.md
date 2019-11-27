<h1 align="center">🛳 Ship.js</h1>

<p align="center">
  <a href="http://npmjs.com/package/shipjs"><img alt="npm" src="https://img.shields.io/npm/v/shipjs"></a>
  <a href="https://circleci.com/gh/algolia/shipjs"><img alt="CircleCI" src="https://img.shields.io/circleci/build/gh/algolia/shipjs"></a>
  <a href="https://github.com/algolia/shipjs/blob/master/LICENSE"><img alt="NPM" src="https://img.shields.io/npm/l/shipjs"></a>
  <a href="https://github.com/algolia/shipjs#contributors-"><img alt="All Contributors" src="https://img.shields.io/badge/all_contributors-7-orange.svg"></a>
</p>

<p align="center">
  Take control of what is going to be your next release.
</p>

## Why 🤷🏻‍

Coding is fun, debugging and testing are okay, but releasing is NOT.

When releasing, you go through something like the following:

- Update the version in `package.json`
- Update the changelog
- Actually release it (e.g. `yarn build && yarn publish`)
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

![Preview][gif]

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

## A little deeper look ⁉️

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

According to your merge strategy, you might either `Squash and merge` or `Merge pull request`.

For more information, please refer to the mergeStrategy section of the [guide][guide-merge-strategy].

### Part 3. Trigger a release (`shipjs trigger`)

On your terminal, `git pull` on `master` branch. And run `shipjs trigger`. It will check the following conditions whether it should proceed releasing or not.

- if it's `master` branch now
- if the latest commit message is like `chore: releases v1.0.1 (#xx)`

If the conditions are met, `shipjs trigger` will briefly do the following:

- Send a Slack message to notify the beginning of the release(If configured).
- Run test, build and release it.
- `git tag v1.0.1`.
- Push them to git remote.
- Create a release on GitHub
- Notify at Slack.

You can run `shipjs trigger --dry-run` just to see what will be executed without actual execution.

And you can configure your CI service to run the Part 3 on behalf of you. What you need to do is just to make it run `shipjs trigger` every time there is a new commit. It's okay to do so because `shipjs trigger` triggers release only when the conditions are met. If not, it skips.

## Installation

Running the following command will guide you to set it up interactively.

```bash
npx shipjs setup
```

Otherwise, you can still do it manually.

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

Do you want to set it up now? Then, let's move on to the [GUIDE.md][guide].

## How is it different from semantic-release?

**semantic-release** is a tool for `fully automated version management and package publishing`.

Ship.js gives you more control over the release process. Ship.js automatically creates a PR before publishing every release, so that you can:

- Confirm the next version is correct.
- Confirm which commits are going to be released and discuss them with colleagues.
- Edit the automatically generated changelog for clarity & readability.
- Run any automated tests on the package release candidate.
- Build a release candidate automatically (with [Pika CI](https://github.com/marketplace/pika-ci-cd)).

## Contributing

You can create an issue for bug, feature request or your opinion.

And we also appreciate your PRs. The detailed contribution guide is coming soon.

## Getting Started

Let's move on to the [GUIDE.md][guide].

[gif]: https://github.com/algolia/shipjs/blob/master/preview.gif
[guide]: https://github.com/algolia/shipjs/blob/master/GUIDE.md
[guide-merge-strategy]: https://github.com/algolia/shipjs/blob/master/GUIDE.md#mergestrategy

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/eunjae_lee"><img src="https://avatars3.githubusercontent.com/u/499898?v=4" width="100px;" alt="Eunjae Lee"/><br /><sub><b>Eunjae Lee</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=eunjae-lee" title="Code">💻</a> <a href="https://github.com/algolia/shipjs/commits?author=eunjae-lee" title="Documentation">📖</a></td>
    <td align="center"><a href="http://www.fredkschott.com"><img src="https://avatars1.githubusercontent.com/u/622227?v=4" width="100px;" alt="Fred K. Schott"/><br /><sub><b>Fred K. Schott</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=FredKSchott" title="Documentation">📖</a></td>
    <td align="center"><a href="https://uechi.io"><img src="https://avatars0.githubusercontent.com/u/431808?v=4" width="100px;" alt="Yasuaki Uechi"/><br /><sub><b>Yasuaki Uechi</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=uetchy" title="Code">💻</a> <a href="https://github.com/algolia/shipjs/commits?author=uetchy" title="Documentation">📖</a></td>
    <td align="center"><a href="https://jeetiss.github.io/"><img src="https://avatars1.githubusercontent.com/u/6726016?v=4" width="100px;" alt="Ivakhnenko Dmitry"/><br /><sub><b>Ivakhnenko Dmitry</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=jeetiss" title="Code">💻</a></td>
    <td align="center"><a href="https://ghuser.io/jamesgeorge007"><img src="https://avatars2.githubusercontent.com/u/25279263?v=4" width="100px;" alt="James George"/><br /><sub><b>James George</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=jamesgeorge007" title="Code">💻</a> <a href="https://github.com/algolia/shipjs/commits?author=jamesgeorge007" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.patreon.com/kazupon"><img src="https://avatars1.githubusercontent.com/u/72989?v=4" width="100px;" alt="kazuya kawaguchi"/><br /><sub><b>kazuya kawaguchi</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=kazupon" title="Code">💻</a></td>
    <td align="center"><a href="https://tyankatsu.netlify.com/"><img src="https://avatars0.githubusercontent.com/u/28397593?s=460&v=4" width="100px;" alt="tyankatsu"/><br /><sub><b>tyankatsu</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=tyankatsu0105" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
