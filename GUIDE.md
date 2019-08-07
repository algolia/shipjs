# Guide

<!-- toc -->

- [Integrate with Circle CI](#integrate-with-circle-ci)
  - [NPM Token](#npm-token)
  - [GitHub Token](#github-token)
- [Useful Configurations](#useful-configurations)
  - [`slackIncomingHook`](#slackincominghook)
  - [`mergeStrategy`](#mergestrategy)
    - [`toSameBranch` strategy](#tosamebranch-strategy)
    - [`toReleaseBranch` strategy](#toreleasebranch-strategy)
- [All Configurations](#all-configurations)
- [Commands](#commands)
  - [`shipjs prepare`](#shipjs-prepare)
  - [`shipjs release`](#shipjs-release)

<!-- tocstop -->

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

## Integrate with Circle CI

A minimal `.circleci/config.yml` looks like the following:

```yml
version: 2
jobs:
  build:
    docker:
      - image: "circleci/node:latest"
    steps:
      - checkout
      - run:
          name: Install
          command: yarn install
      - run:
          name: Try to Release
          command: yarn shipjs:release
```

Every time Circle CI runs the flow above, `yarn shipjs:release` will be executed, and it will check if it's a condition to release. It will, by default, check the latest commit message and the current branch.

### NPM Token

Setup an NPM token to allow Ship.js(at CircleCI) to release the package to NPM.

1. Login at [https://www.npmjs.com/](https://www.npmjs.com/), click your profile icon and go to "Tokens".
2. Click "Create New Token", make sure the access level is "Read and Publish" and copy the token.
3. At CircleCI, go to "Project Settings" → "BUILD SETTINGS" → "Environment Variables".
4. Click "Add Variable".
   - Name: `NPM_AUTH_TOKEN`
   - Value: Paste the token from clipboard.

### GitHub Token

Setup a GitHub token to allow Ship.js(at CircleCI) to create a git tag and push it to remote after release.

1. At CircleCI, go to the "Project Settings" → "PERMISSIONS" → "Checkout SSH Keys".
2. Find "Add user key" section, and click the button to create the user key.

Integration with other CIs should be similar to this.

## Useful Configurations

At the root of your project, you can create `ship.config.js` file to customize the process.

All the configs are optional. It's okay not to configure anything at all as long as it meets your needs.

### `slackIncomingHook`

```js
module.exports = {
  slackIncomingHook: "https://..."
};
```

With this configured, `shipjs release` will send messages to your Slack channel at the beginning and the end of the release.

### `mergeStrategy`

```js
module.exports = {
  mergeStrategy: {
    toSameBranch: ["master"]
  }
};
```

The default value for `mergeStrategy` is the above. It means `shipjs prepare` will work only on `master` branch.

`shipjs prepare` will checkout to a staging branch(e.g. `releases/v1.0.1`) and create a pull-request from the staging branch to `master`.

So, by default, Ship.js will work on your `master` branch only.

Let's look at the configuration below:

```js
module.exports = {
  mergeStrategy: {
    toSameBranch: ["legacy"],
    toReleaseBranch: {
      develop: "master"
    }
  }
};
```

Let's assume `develop` is working branch and `master` is the latest released branch.

And you also maintain a `legacy` branch. You didn't split branch for `legacy`.

#### `toSameBranch` strategy

When you run `shipjs prepare` on `legacy` branch, it will

- checkout to a staging branch(e.g. `releases/v1.8.3`)
- create a pull-request from the staging branch to `legacy` branch

Let's assume you configured your CI to monitor `legacy` branch.
When you review and merge the PR, your CI will run `shipjs release` and it will

1. run tests
2. release to NPM
3. create a git tag(e.g. `v1.8.3`)
4. push to git remote

#### `toReleaseBranch` strategy

When you run `shipjs prepare` on `develop` branch, it will

- checkout to a staging branch(e.g. `releases/v2.4.3`)
- create a pull-request from the staging branch to `master` branch

When you review and merge the PR, your CI will run `shipjs release` and it will

1. run tests
2. release to NPM
3. create a git tag(e.g. `v1.8.3`)
4. merge `master` back to `develop`
5. push to git remote

You see the slight difference between two strategies?

### Release projects somewhere other than NPM

You can use Ship.js to release projects somewhere other than NPM.

For example,

```js
module.exports = {
  publishCommand: () => "npx now"
};
```

By default, `publishCommand` returns `yarn publish` or `npm publish`. You can override it like the above to release it to wherever you want.

## All Configurations

[See here for all configurations](./CONFIG.md)

## Commands

### `shipjs prepare`

```
$ shipjs prepare --help
NAME
        shipjs prepare - Prepare a release.

USAGE
        shipjs prepare [--help] [--dir PATH] [--yes] [--first-release] [--release-count COUNT] [--dry-run]

OPTIONS
        -h, --help
          Print this help

        -d, --dir PATH
          Specify the PATH of the repository (default: the current directory).

        -y, --yes
          Skip all the interactive prompts and use the default values.

        -f, --first-release
          Generate the CHANGELOG for the first time

        -r, --release-count COUNT
          How many releases to be generated from the latest

        -D, --dry-run
          Displays the steps without actually doing them.
```

### `shipjs release`

```
$ shipjs release --help
NAME
        shipjs release - Release it.

USAGE
        shipjs prepare [--help] [--dir PATH] [--dry-run]

OPTIONS
        -h, --help
          Print this help

        -d, --dir PATH
          Specify the PATH of the repository (default: the current directory).

        -D, --dry-run
          Displays the steps without actually doing them.
```
