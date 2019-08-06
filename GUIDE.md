# Guide

<!-- toc -->

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

Everytime Circle CI runs the flow above, `yarn shipjs:release` will be executed, and it will check if it's a condition to release. It will by default check if the latest commit message is in convention and the current branch is the right one for release.

### NPM Token

For CircleCI to release the package to NPM, we need to setup an NPM token.

1. Login at [https://www.npmjs.com/](https://www.npmjs.com/), click your profile icon and go to "Tokens".
2. Click "Create New Token" and make sure the access level is "Read and Publish".
3. Copy the token and go to the "Project Settings" at your CircleCI dashboard.
4. Find "Environment Variables" under "BUILD SETTINGS".
5. Click "Add Variable".
   - "Name" is `NPM_AUTH_TOKEN`
   - For "Value", paste the token that was generated at NPM.

### Github Token

After releasing it, Ship.js will create a git tag and push it to remote. In order to do that, Ship.js requires a github token with such access.

1. Go to the "Project Settings" at your CircleCI dashboard.
2. Go to "Checkout SSH Keys" under "PERMISSIONS".
3. Find "Add user key" section, and click the button to create the user key.

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
