# All Configurations

## `monorepo`

_default:_ `undefined`

```js
// example
module.exports = {
  monorepo: {
    mainVersionFile: 'package.json',
    packagesToBump: ['packages/*', 'examples/*'],
    packagesToPublish: ['packages/*'],
  },
};
```

If `monorepo` is defined, Ship.js will treat the project as a monorepo.

:::warning NOTICE
Ship.js currently does not provide independent versioning. It means all the packages in the monorepo must have the same version.
:::

- **`shipjs prepare`**

1. Ship.js reads version from `mainVersionFile`.
2. When next version is decided, Ship.js will update the version at `mainVersionFile`.
3. Ship.js will update all the versions in `packagesToBump`.

- **`shipjs trigger`**

1. Ship.js will only publish the packages from `packagesToPublish`.

## `shouldPrepare`

_used at_: `shipjs prepare`

_default_: `undefined`

```js
// example
shouldPrepare: ({
  commits,
  nextVersion,
  releaseType,
  releaseTag,
  commitNumbersPerType,
}) => {
  /* ... */
};
```

This is a lifecycle hook where you can decide whether or not to proceed with the preparation.

- commits: string of commit titles. Be aware that it's not an array of strings. It comes from `git log --pretty=format:%s`.
- nextVersion: `x.y.z`
- releaseType: `'major' | 'minor' | 'patch' | 'prerelease'`
- releaseTag: `'latest' | 'alpha' | 'beta' | ...`
- commitNumbersPerType: an object with keys of conventional commit type, and with values of number of commits of the type. `{ feat: 2, fix: 4, chore: 8 }`

```js
// example
shouldPrepare: ({ releaseType, commitNumbersPerType }) => {
  const { fix = 0 } = commitNumbersPerType;
  if (releaseType === 'patch' && fix === 0) {
    return false;
  }
  return true;
};
```

With the config above, you can skip if it's going to be a patch release but without any `fix` commits.

## `updateChangelog`

_used at_: `shipjs prepare`

_default:_ `true`

If `false`, Ship.js won't run `conventional-changelog` during `shipjs prepare`.

## `conventionalChangelogArgs`

_used at_: `shipjs prepare`

_default:_ `'-p angular -i CHANGELOG.md -s'`

This is passed to `conventional-changelog` CLI to update CHANGELOG.md.

## `installCommand`

_used at_: `shipjs prepare`

_default:_

```js
installCommand: ({ isYarn }) =>
    isYarn ? 'yarn install --silent' : 'npm install'`
```

## `getNextVersion`

_used at_: `shipjs prepare`

_default:_ `undefined`

This hook determines what the next version should be. It returns the next version as string. If not given, by default, Ship.js follows [conventional commits](https://www.conventionalcommits.org).

- revisionRange: for example, `v0.1.0..HEAD`
- commitTitles: string of commit titles. Be aware that it's not an array of strings. It comes from `git log --pretty=format:%s`.
- commitBodies: string of commit bodies. Be aware that it's not an array of strings. It comes from `git log --pretty=format:%b`.
- currentVersion: for example, `0.1.0`
- dir: current working dir

```js
// example
getNextVersion: ({ revisionRange, commitTitles, commitBodies, currentVersion, dir }) => {
  // do something
  return nextVersion; // for example, `"0.2.0"`
}
```

## `versionUpdated`

_used at_: `shipjs prepare`

_default:_ `undefined`

```js
// example
versionUpdated: ({ version, releaseType, dir, exec }) => {
  /* ... */
};
```

This is a lifecycle hook where you can put additional code after version is updated. You can read [an example here](../guide/useful-config.html#extra-work-on-updating-version).

- version: `x.y.z`
- releaseType: `'major' | 'minor' | 'patch' | 'prerelease'`
- dir: current working dir
- exec: `shelljs.exec` bound with the `dir`.
  - For example, `exec('yarn some-command')`
  - This is a synchronous function.

## `beforeCommitChanges`

_used at_: `shipjs prepare`

_default:_ `undefined`

```js
// example
beforeCommitChanges: ({ nextVersion, releaseType, exec, dir }) => {
  /* ... */
};
```

This is a lifecycle hook which is executed right before `git commit` happens. You can put additional code like modifying some other files.

## `pullRequestReviewers`

_used at_: `shipjs prepare`

_default:_ `undefined`

You can put an array of strings.

```js
pullRequestReviewers: ['user1', 'user2', 'user3'];
```

One thing you need to be aware of is, you cannot assign yourself as a reviewer. You can put github username of your team or colleagues.

## `pullRequestTeamReviewers`

_used at_: `shipjs prepare`

_default:_ `undefined`

You can put an array of strings.

```js
pullRequestTeamReviewers: ['team-username1'];
```

## `buildCommand`

_used at_: `shipjs trigger`

_default:_

```js
buildCommand: ({ isYarn, version }) =>
  isYarn ? 'yarn build' : 'npm run build';
```

If there's nothing to build before publishing, you can skip this step:

```js
buildCommand: () => null;
```

## `beforePublish`

_used at_: `shipjs trigger`

_default:_ `undefined`

```js
// example
beforePublish: ({ exec, dir }) => {
  /* do something */
};
```

## `publishCommand`

_used at_: `shipjs trigger`

_default:_

```js
publishCommand: ({ isYarn, tag, defaultCommand, dir }) => defaultCommand;
```

`defaultCommand`:

```js
isYarn
  ? `npm_config_registry=https://registry.npmjs.org/ npm publish --tag ${tag}`
  : `npm publish --tag ${tag}`;
```

By default, `publishCommand` will return `npm publish ...`.

### Scoped Package

If your project is a scoped package and you want it to be public, you need to add `--access public` to the publish command. To do so,

```js
publishCommand: ({ isYarn, tag, defaultCommand, dir }) =>
  `${defaultCommand} --access public`;
```

### Monorepo

If your project is a monorepo and if you want to use different publish command per package,

```js
publishCommand: ({ isYarn, tag, defaultCommand, dir }) => {
  if (dir.endsWith('/website')) {
    return 'npx now';
  } else {
    return defaultCommand;
  }
};
```

## `afterPublish`

_used at_: `shipjs trigger`

_default:_ `undefined`

```js
// example
afterPublish: ({ exec, dir, version, releaseTag }) => {
  /* do something */
};
```

## `testCommandBeforeRelease`

_used at_: `shipjs trigger`

_default:_ `undefined`

Ship.js runs this command at `shipjs trigger` before publishing the package to make sure if it works correctly.

By default, it's undefined because you may already have a CI service running tests on your GitHub PR.

If you want to run something right before release, you can do so like the following:

```js
testCommandBeforeRelease: ({ isYarn }) =>
  isYarn ? 'yarn test' : 'npm run test';
```

## `releases`

_used at_: `shipjs trigger`

_default:_ `undefined`

By default, Ship.js will create a release on "releases" tab at GitHub.

By defining `releases`, you can optionally attach assets or customize content of release.

```js
// example
releases: {
  assetsToUpload, // optional
  extractChangelog, // optional
}
```

- `assetsToUpload`: String | String[] | Function
  - `archive.zip`
  - `archive.*.zip`
  - `['package.json', 'dist/*.zip']`
  - `({dir, version, tagName}) => [...]`
- `extractChangelog`: `({ version, dir }) => 'some specific changelog to that version'`

## `appName`

_used at_: `shipjs trigger`

_default:_ `undefined`

```js
// example
appName: 'My Awesome Package';
```

This is used when Ship.js sends message to your Slack channel. If it's `undefined`, Ship.js will take `name` from your `package.json` by default.

## Messaging to Slack

_used at_: `shipjs trigger`

If you configure an environment variable `SLACK_INCOMING_HOOK`, Ship.js will send messages

- when `shipjs prepare` is finished (`prepare`)
- when `shipjs trigger` is finished (`releaseSuccess`)

You can specify sender's username:

```js
slack: {
  default: {
    username: 'My Release Bot',
  }
}
```

As described above, there are three phases of Slack messages: `prepare` and `releaseSuccess`.

You can customize the messages. The following is the default value. You can read [this documentation from Slack](https://api.slack.com/docs/messages/builder) to learn how to format messages.

```js
slack: {
  prepared: ({ appName, version, pullRequestUrl }) => ({
    pretext: `:writing_hand: The release for *${appName}@${version}* is prepared!`,
    fields: [
      {
        title: 'Branch',
        value: 'master',
        short: true,
      },
      {
        title: 'Version',
        value: version,
        short: true,
      },
      {
        title: 'Pull Request',
        value: pullRequestUrl,
        short: false,
      },
    ],
  }),
  releaseSuccess: ({
    appName,
    version,
    latestCommitHash,
    latestCommitUrl,
    repoURL,
  }) => ({
    pretext: `:tada: Successfully released *${appName}@${version}*`,
    fields: [
      {
        title: 'Branch',
        value: 'master',
        short: true,
      },
      {
        title: 'Commit',
        value: `*<${latestCommitUrl}|${latestCommitHash}>*`,
        short: true,
      },
      {
        title: 'Version',
        value: version,
        short: true,
      },
      {
        title: 'CHANGELOG',
        value: `${repoURL}/blob/master/CHANGELOG.md`,
      },
    ],
  }),
}
```

If you don't want, you can skip some of the messages:

```js
slack: {
  prepared: null,
}
```

In this way, Ship.js won't send a message when a pull request is prepared.

When Ship.js loads your `ship.config.js`, it deep-merges `slack` object.

```js
defaultConfig = {
  slack: {
    default: {
      username: 'Ship.js',
    },
    prepared: () => {
      /* ... */
    },
    releaseSuccess: () => {
      /* ... */
    },
  },
};

yourConfig = {
  slack: {
    prepared: null,
  },
};

finalConfig = {
  slack: {
    default: {
      username: 'Ship.js',
    },
    prepared: null, // <- only this is affected
    releaseSuccess: () => {
      /* ... */
    },
  },
};
```
