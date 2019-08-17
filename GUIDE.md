# Guide

<!-- toc -->

- [Installation](#installation)
  - [Dry Mode](#dry-mode)
- [Integrate with Circle CI](#integrate-with-circle-ci)
  - [NPM Token](#npm-token)
  - [GitHub Token](#github-token)
- [Useful Configurations](#useful-configurations)
  - [`slackIncomingHook`](#slackincominghook)
  - [`mergeStrategy`](#mergestrategy)
    - [`toSameBranch` strategy](#tosamebranch-strategy)
    - [`toReleaseBranch` strategy](#toreleasebranch-strategy)
  - [Release projects somewhere other than NPM](#release-projects-somewhere-other-than-npm)
  - [Release your monorepo project](#release-your-monorepo-project)
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

### Dry Mode

If you're not sure, you can always run it in dry mode.

```bash
$ shipjs prepare --dry-run
or
$ shipjs release --dry-run
```

It will show you which steps are going to be executed without actually executing them.

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

### Release your monorepo project

Ship.js currently supports monorepo project unless you want independent versioning in your packages.

Let's say you have the following package.json files:

- package.json
- packages/first-package/package.json
- packages/second-package/package.json
- example/package.json

```js
module.exports = {
  packageJsons: [
    "package.json",
    "packages/first-package/package.json",
    "packages/second-package/package.json",
    "example/package.json"
  ]
};
```

With the config above, Ship.js will read the current version from the first entry from the array, which is `package.json`. After figuring out the next version, the next version will be updated to the all package.json files.

### Schedule your release

By running `yarn shipjs:prepare`, you will get a pull-request for next release. What if you even automate this?

You can configure your CI to run `yarn shipjs:prepare` periodically.

```yml
version: 2
jobs:
  prepare_release:
    docker:
      - image: "circleci/node:latest"
    steps:
      - checkout
      - run:
          name: Install
          command: yarn install
      - run:
          name: Install hub
          command: |
            sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
            /home/linuxbrew/.linuxbrew/bin/brew shellenv >> $BASH_ENV
            eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)
            brew install hub
      - run:
          name: Prepare release
          command: |
            git config --global user.email "you@example.com"
            git config --global user.name "Your Name"
            yarn shipjs:prepare --yes --no-browse
workflows:
  version: 2
  prepare_release_every_tuesday:
    triggers:
      - schedule:
          cron: "0 9 * * 2"
          filters:
            branches:
              only:
                - master
    jobs:
      - prepare_release
```

`GITHUB_TOKEN` is required for CircleCI to create a pull-request.

1. Go to https://github.com/settings/tokens/new
2. Check "repo(Full control of private repositories)"
3. Generate/copy the token
4. At CircleCI, go to "Project Settings" → "BUILD SETTINGS" → "Environment Variables".
5. Click "Add Variable".
   - Name: `GITHUB_TOKEN`
   - Value: Paste the token from clipboard.

Now, every Tuesday at 9am, new pull-request will be created. All you need to do is review the pull-request and merge it. Then the rest will be automatically done.

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
