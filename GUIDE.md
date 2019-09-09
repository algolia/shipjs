# Guide

<!-- toc -->

- [Installation](#installation)
  - [Install `hub`](#install-hub)
  - [Dry Mode](#dry-mode)
- [Automate Part 3 (`shipjs trigger`) on your CI service](#automate-part-3-shipjs-trigger-on-your-ci-service)
  - [NPM Token](#npm-token)
  - [GitHub Token](#github-token)
- [Useful Configurations](#useful-configurations)
  - [`slackIncomingHook`](#slackincominghook)
  - [`mergeStrategy`](#mergestrategy)
    - [`toSameBranch` strategy](#tosamebranch-strategy)
    - [`toReleaseBranch` strategy](#toreleasebranch-strategy)
  - [Release projects somewhere other than NPM](#release-projects-somewhere-other-than-npm)
  - [Release your monorepo project](#release-your-monorepo-project)
  - [Extra work on updating version](#extra-work-on-updating-version)
  - [Schedule your release](#schedule-your-release)
  - [Assign Reviewers](#assign-reviewers)
- [All Configurations](#all-configurations)
- [Commands](#commands)
  - [`shipjs prepare`](#shipjs-prepare)
  - [`shipjs trigger`](#shipjs-trigger)

<!-- tocstop -->

## Installation

```bash
npm install --save-dev shipjs

or

yarn add -D shipjs
```

Add the following to the `scripts` section in your `package.json`.

```js
"scripts: {
  //...
  "release:prepare": "shipjs prepare",
  "release:trigger": "shipjs trigger",
}
```

### Install `hub`

To use Ship.js, you need to install `hub`.

```bash
brew install hub
```

To configure `hub`, create a file `~/.config/hub` and fill the following content:

```
github.com:
- user: YOUR-GITHUB-USERNAME
  oauth_token: YOUR-PERSONAL-ACCESS-TOKEN
  protocol: https
```

You can get an access token from [here](https://github.com/settings/tokens).

Or you can simply run `hub api user`, follow the instruction and it will generate the token and write the config file for you.

### Dry Mode

If you're not sure, you can always run commands in dry mode.

```bash
yarn release:prepare --dry-run

or

yarn release:trigger --dry-run
```

It will show you which steps are going to be executed without actually executing them.

## Doing everything on your machine

- Part 1: `yarn release:prepare` will create a pull-request.
- Part 2: Review and merge the PR.
- Part 3: `git pull` and `yarn release:trigger` to actually publish it to NPM.

## Automate Part 3 (`shipjs trigger`) on your CI service

This guide is based on CircleCI. It may be done similarly on other CI services.

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
          command: yarn release:trigger
```

At Part 2, if you merge the PR, a new commit will be added and CircleCI will run `yarn release:trigger`. Then, it will check if the latest commit message is in convention and the current branch is right. If the conditions are met, it will trigger a release. Otherwise, it will skip.

By default, it will check if the commit message is `chore: release vx.y.z`(which is the title of the PR). So when you merge the PR, you need to `Squash and merge` to make it one commit with that message. You can force this behavior by configuring the merge button at your repository settings page.

### NPM Token

Setup an NPM token to allow Ship.js(**at CircleCI**) to release the package to NPM.

1. Login at [https://www.npmjs.com/](https://www.npmjs.com/), click your profile icon and go to "Tokens".
2. Click "Create New Token", make sure the access level is "Read and Publish" and copy the token.
3. At CircleCI, go to "Project Settings" → "BUILD SETTINGS" → "Environment Variables".
4. Click "Add Variable".
   - Name: `NPM_AUTH_TOKEN`
   - Value: Paste the token from clipboard.

### GitHub Token

Setup a GitHub token to allow Ship.js(**at CircleCI**) to create a git tag and push it to remote after release.

1. Go to https://github.com/settings/tokens/new
2. Check "repo(Full control of private repositories)"
3. Generate/copy the token
4. At CircleCI, go to "Project Settings" → "BUILD SETTINGS" → "Environment Variables".
5. Click "Add Variable".
   - Name: `GITHUB_TOKEN`
   - Value: Paste the token from clipboard.

## Useful Configurations

At the root of your project, you can create `ship.config.js` file to customize the process.

Everything is optional.

### `mergeStrategy`

```js
module.exports = {
  mergeStrategy: {
    toSameBranch: ["master"]
  }
};
```

The default value for `mergeStrategy` is the above. It means `shipjs prepare` will work only on `master` branch.

`shipjs prepare` will checkout to a staging branch(e.g. `releases/v1.0.1`) and create a PR from the staging branch to `master`.

So, by default, Ship.js works on your `master` branch only.

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

Let's assume you're working on the latest version 1.x on `develop` and `master` is the latest release branch.

You also maintain a `legacy` version which is 0.x.

#### `toSameBranch` strategy

When you run `shipjs prepare` on `legacy` branch, it will

- checkout to a staging branch(e.g. `releases/v0.8.3`).
- create a PR from the staging branch to `legacy` branch.

Let's assume you configured your CI to monitor `legacy` branch.
When you review and merge the PR, your CI will run `shipjs trigger` and it will

1. run tests.
2. release to NPM.
3. create a git tag(e.g. `v0.8.3`).
4. push to git remote.

#### `toReleaseBranch` strategy

When you run `shipjs prepare` on `develop` branch, it will

- checkout to a staging branch(e.g. `releases/v1.4.2`).
- create a PR from the staging branch to `master` branch.

When you review and merge the PR, your CI will run `shipjs trigger` and it will

1. run tests.
2. release to NPM.
3. create a git tag(e.g. `v1.4.2`).
4. merge `master` back to `develop`.
5. push to git remote.

So the flow is like this:

> develop -> releases/v1.4.3 -> master -> (merged back to) develop

You see the difference between two strategies, right?

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

Ship.js currently supports monorepo project(Independent versioning is not supported at the moment).

```js
module.exports = {
  monorepo: {
    readVersionFrom: 'package.json',  // or `lerna.json`, or whatever a json file you can read the latest `version` from.
    packagesToBump: ['packages/*', 'examples/*'],
    packagesToPublish: ['packages/*'],
  }
};
```

With the config above, `prepare` command will

1. Read the current version from `package.json` file at the project root directory.
2. Calculate the next version based on commit messages.
3. Update the next version over `package.json` files in `['packages/*', 'examples/*']`.

And `trigger` command will publish packages in `['packages/*']`.

When Ship.js handles `packagesToBump` and `packagesToPublish`, it will only list directories with `package.json` inside them.

### Extra work on updating version

After bumping the version, you may want to do extra work regarding the version. Ship.js provides `versionUpdated` hook.

```js
const fs = require('fs');
const path = require('path');

module.exports = {
  versionUpdated: ({ version, dir, exec }) => {
    // update `lerna.json`
    const lernaConfigPath = path.resolve(dir, 'lerna.json');
    const lernaConfig = JSON.parse(fs.readFileSync(lernaConfigPath).toString());
    lernaConfig.version = version;
    fs.writeFileSync(lernaConfigPath, JSON.stringify(lernaConfig, null, 2));

    // update `src/lib/version.js`
    const versionPath = path.resolve(dir, 'src/lib/version.js');
    fs.writeFileSync(versionPath, `export default "${version}";\n`);

    // update dependencies in monorepo
    exec(`yarn workspace example-foo add my-lib@${version}`);
    exec(`yarn workspace example-bar add my-lib@${version}`);
  },
}
```

### Schedule your release

At Part 1, by running `yarn release:prepare`, you get a PR for next release. What if you even automate this?

You can configure your CI to run periodically `yarn release:prepare`.

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
            yarn release:prepare --yes --no-browse
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

`GITHUB_TOKEN` is required for CircleCI to create a PR. Make sure you have it configured as an environment variable.

Now, every Tuesday at 9am, new PR will be created. All you need to do is review the PR and merge it. Then the rest will be automatically done.

If you're using CircleCI v2.0, you can also manually trigger the job using API call. You can refer to [this document](https://circleci.com/docs/2.0/api-job-trigger/), but it won't work in CircleCI v2.1.

### Assign Reviewers

You can assign reviewers on the PR.

```js
module.exports = {
  pullRequestReviewer: "user-name-or-team-name"
};
```

One thing you need to be aware of is, you cannot assign yourself as a reviewer. You can put github username of your team or colleagues. The value is a comma-separated list(no spaces around the comma).

The assignees will receive a notification from GitHub when the PR is created. Whenever they review and merge the PR, it will be automatically released by the prior configuration you've done [above](#integrate-with-circle-ci).

### `slackIncomingHook`

```js
module.exports = {
  slackIncomingHook: "https://..."
};
```

With this configured, messages will be sent to your Slack channel

- when `shipjs prepare` is finished
- when `shipjs trigger` begins
- when `shipjs trigger` is finished

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

### `shipjs trigger`

```
$ shipjs trigger --help
NAME
        shipjs trigger - Trigger a release.

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
