# Useful Configurations

At the root of your project, you can create `ship.config.js` file to customize the process.

Everything is optional.

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

At Part 1, by running `yarn run release`, you get a PR for next release. What if you even automate this?

You can configure your CI to run periodically `yarn run release`.

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
            yarn run release --yes --no-browse
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
  pullRequestReviewers: ["user-login1", "user-login2", "user-login3"],

  ...

  // also
  pullRequestTeamReviewers: ["team-slug1", "team-slug2"],
};
```

One thing you need to be aware of is, you cannot assign yourself as a reviewer. You can put github username of your team or colleagues. The value can be either a string or an array of strings.

The assignees will receive a notification from GitHub when the PR is created. Whenever they review and merge the PR, it will be automatically released by the prior configuration you've done [here](../guide/getting-started.html#automate-part-3-trigger).

## Release Snapshot

If you want to maintain a branch for release snapshot, you can use `afterPublish` hook.

For example, you normally work on `develop` and want to have the latest release at `master`.

```js
module.exports = {
  afterPublish: ({ exec }) => {
    exec(`git config --global user.email "your@email.com"`);
    exec(`git config --global user.name "Your Name"`);
    
    exec('git checkout master');
    exec('git merge develop');
    exec('git push origin master');
  }
}
```

In this way, you can keep `master` up-to-date with the latest release.

:::warning NOTICE
Normally you cannot create commits and push them from your CI service.

In case of CircleCI, you can read the following document to configure either deploy key or user key to enable it.

[Deployment Keys and User Keys - CircleCI](https://circleci.com/docs/2.0/gh-bb-integration/#deployment-keys-and-user-keys)
:::


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
