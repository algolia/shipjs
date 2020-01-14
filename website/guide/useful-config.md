# Useful Configurations

At the root of your project, you can create `ship.config.js` file to customize the process.

Everything is optional.

## `mergeStrategy`

```js
module.exports = {
  mergeStrategy: {
    toSameBranch: ['master'],
  },
};
```

The default value for `mergeStrategy` is the above. It means `shipjs prepare` will work only on `master` branch.

`shipjs prepare` will checkout to a staging branch(e.g. `releases/v1.0.1`) and create a PR from the staging branch to `master`.

So, by default, Ship.js works on your `master` branch only.

Let's look at the configuration below:

```js
module.exports = {
  mergeStrategy: {
    toSameBranch: ['legacy'],
    toReleaseBranch: {
      develop: 'master',
    },
  },
};
```

Let's assume you're working on the latest version 1.x on `develop` and `master` is the latest release branch.

You also maintain a `legacy` version which is 0.x.

### `toSameBranch` strategy

When you run `shipjs prepare` on `legacy` branch, it will

- checkout to a staging branch(e.g. `releases/v0.8.3`).
- create a PR from the staging branch to `legacy` branch.

Let's assume you configured your CI to monitor `legacy` branch. When you review and merge the PR, your CI will run `shipjs trigger` and it will

1. run tests.
2. release to NPM.
3. create a git tag(e.g. `v0.8.3`).
4. push to git remote.

> When merging a PR from this strategy, you need to "Squash and merge" and make sure the commit title is the same with the title of the PR.
>
> You can go to "Settings" menu of your repository, and even force "Squash and merge" behavior under "Merge button" section.

### `toReleaseBranch` strategy

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

> When merging a PR from this strategy, you need to "Merge pull request(Create a merge commit)" and also, you must modify the commit title to the title of the PR.
>
> You go to "Settings" menu of your repository, and even force "Merge pull request" behavior under "Merge button" section.

## Monorepo

Ship.js currently supports monorepo project(Independent versioning is not supported at the moment).

```js
module.exports = {
  monorepo: {
    mainVersionFile: 'package.json', // or `lerna.json`, or whatever a json file you can read the latest `version` from.
    packagesToBump: ['packages/*', 'examples/*'],
    packagesToPublish: ['packages/*'],
  },
};
```

With the config above, `prepare` command will

1. Read the current version from `package.json` file at the project root directory.
2. Calculate the next version based on commit messages.
3. Update the next version over `package.json` files in `['packages/*', 'examples/*']`.

And `trigger` command will publish packages in `['packages/*']`.

When Ship.js handles `packagesToBump` and `packagesToPublish`, it will only list directories with `package.json` inside them.

## Extra work on updating version

After bumping the version, you may want to do extra work regarding the version. Ship.js provides `versionUpdated` hook.

```js
const fs = require('fs');
const path = require('path');

module.exports = {
  versionUpdated: ({ version, releaseType, dir, exec }) => {
    // update `lerna.json`
    const lernaConfigPath = path.resolve(dir, 'lerna.json');
    const lernaConfig = JSON.parse(fs.readFileSync(lernaConfigPath).toString());
    lernaConfig.version = version;
    fs.writeFileSync(lernaConfigPath, JSON.stringify(lernaConfig, null, 2));

    // update `src/lib/version.js`
    const versionPath = path.resolve(dir, 'src/lib/version.js');
    fs.writeFileSync(versionPath, `export default "${version}";\n`);

    // update dependencies (if you're using yarn workspace)
    exec(`yarn workspace example-foo add my-lib@${version}`);
    exec(`yarn workspace example-bar add my-lib@${version}`);
  },
};
```

## Schedule your release

At Part 1, by running `yarn release:prepare`, you get a PR for next release. What if you even automate this?

You can configure your CI to run periodically `yarn release:prepare`.

```yml
version: 2
jobs:
  prepare_release:
    docker:
      - image: 'circleci/node:latest'
    steps:
      - checkout
      - run:
          name: Install
          command: yarn install
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
          cron: '0 9 * * 2'
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

## Assign Reviewers

You can assign reviewers on the PR.

```js
module.exports = {
  pullRequestReviewer: "user-login"
  // or
  pullRequestReviewer: ["user-login1", "user-login2", "user-login3"],

  ...

  // also
  pullRequestTeamReviewer: "team-slug",
  // or
  pullRequestTeamReviewer: ["team-slug1", "team-slug2"],
};
```

One thing you need to be aware of is, you cannot assign yourself as a reviewer. You can put github username of your team or colleagues. The value can be either a string or an array of strings.

The assignees will receive a notification from GitHub when the PR is created. Whenever they review and merge the PR, it will be automatically released by the prior configuration you've done [here](../guide/getting-started.html#automate-part-3-trigger).

## `SLACK_INCOMING_HOOK`

If you configure an environment variable `SLACK_INCOMING_HOOK`, Ship.js will send messages

- when `shipjs prepare` is finished
- when `shipjs trigger` begins
- when `shipjs trigger` is finished

You can [read more](../reference/all-config.html#messaging-to-slack) to customize this behavior.

## Release somewhere else

You can use Ship.js to release projects somewhere other than NPM.

For example,

```js
module.exports = {
  publishCommand: () => 'npx now',
};
```

By default, `publishCommand` returns `yarn publish` or `npm publish`. You can override it like the above to release it to wherever you want.

If you have configured `monorepo`, this command will run in each package in `monorepo.packagesToPublish`.
