# Getting Started

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
"scripts: {
  //...
  "release:prepare": "shipjs prepare",
  "release:trigger": "shipjs trigger",
}
```

### GitHub Token

GitHub token is used in both `shipjs prepare` and `shipjs trigger`.

1. Go to https://github.com/settings/tokens/new
2. Check "repo(Full control of private repositories)"
3. Generate/copy the token

You can put it in the following two ways:

1. Prepend it in your command like: `GITHUB_TOKEN=xxx shipjs prepare`
2. Create a file named ".env" and put the following content: `GITHUB_TOKEN=xxx` (".env" should not be committed. Add it to ".gitignore".)

If you automate flows in your CI, you can add the token to Environment Variable section in your CI service.

### Dry Mode

If you're not sure, you can always run commands in dry mode.

```bash
yarn release:prepare --dry-run

or

yarn release:trigger --dry-run
```

It will show you which steps are going to be executed without actually executing them.

## On your local machine

- Part 1: `yarn release:prepare` will create a pull request.
- Part 2: Review and merge the PR.
- Part 3: `git pull` and `yarn release:trigger` to actually publish it to NPM.

## Automate Part 3 (`trigger`)

This guide is based on CircleCI. It may be done similarly on other CI services.

A minimal `.circleci/config.yml` looks like the following:

```yaml
version: 2
jobs:
  build:
    docker:
      - image: 'circleci/node:latest'
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

By default, it will check if the commit message is `chore: release vx.y.z`(which is the title of the PR).

According to your merge strategy, you might either `Squash and merge` or `Merge pull request`.

For more information, please refer to the [mergeStrategy section.](./useful-config.html#mergestrategy)

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
