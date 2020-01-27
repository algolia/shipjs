# All Configurations

## `monorepo`

*default:* `undefined`

```js
// example
module.exports = {
  monorepo: {
    mainVersionFile: 'package.json',
    packagesToBump: ['packages/*', 'examples/*'],
    packagesToPublish: ['packages/*'],
  },
}
```

If `monorepo` is defined, Ship.js will treat the project as a monorepo.

:::warning NOTICE
Ship.js currently does not provide independent versioning. It means all the packages in the monorepo must have the same version.
:::

* **`shipjs prepare`**

1. Ship.js reads version from `mainVersionFile`.
2. When next version is decided, Ship.js will update the version at `mainVersionFile`.
3. Ship.js will update all the versions in `packagesToBump`.

* **`shipjs trigger`**

1. Ship.js will only publish the packages from `packagesToPublish`.

## `updateChangelog`

*default:* `true`

If `false`, Ship.js won't run `conventional-changelog` during `shipjs prepare`.

## `conventionalChangelogArgs`

*default:* `'-p angular -i CHANGELOG.md -s'`

This is passed to `conventional-changelog` CLI to update CHANGELOG.md.

## `installCommand`

*default:*
```js
installCommand: ({ isYarn }) =>
    isYarn ? 'yarn install --silent' : 'npm install'`
```

## `versionUpdated`

*default:* `undefined`

```js
// example
versionUpdated: ({ version, releaseType, dir, exec }) => { /* ... */ }
```

This is a lifecycle hook where you can put additional code after version is updated. You can read [an example here](../guide/useful-config.html#extra-work-on-updating-version).

- version: `x.y.z`
- releaseType: `'major' | 'minor' | 'patch' | 'prerelease'`
- dir: current working dir
- exec: `shelljs.exec` bound with the `dir`.
   - For example, `exec('yarn some-command')`
   - This is a synchronous function.

## `beforeCommitChanges`

*default:* `undefined`

```js
// example
beforeCommitChanges: ({ nextVersion, releaseType, exec, dir }) => { /* ... */ }
```

This is a lifecycle hook which is executed right before `git commit` happens. You can put additional code like modifying some other files.

## `pullRequestReviewer`

*default:* `undefined`

You can put either a string or an array of strings.

```js
pullRequestReviewer: "user-name-or-team-name"
// or
pullRequestReviewer: ["user1", "user2", "user3"]
```

One thing you need to be aware of is, you cannot assign yourself as a reviewer. You can put github username of your team or colleagues.

## `mergeStrategy`

*default:*
```js
mergeStrategy: {
  toSameBranch: ['master'],
}
```

This decides how you manage and use your branches for release.

```js
// example
mergeStrategy: {
  toReleaseBranch: {
    develop: 'master'
  }
}

// or
mergeStrategy: {
  toReleaseBranch: {
    master: 'releases/stable',
    legacy: 'releases/legacy',
    next: 'releases/next',
  }
}
```

To learn more, you can read [this guide](../guide/useful-config.html#mergestrategy).

## `buildCommand`

*default:*
```js
buildCommand: ({ isYarn, version }) => (isYarn ? 'yarn build' : 'npm run build')
```

If there's nothing to build before publishing, you can skip this step:

```js
buildCommand: () => null
```

## `beforePublish`

*default:* `undefined`

```js
// example
beforePublish: ({ exec, dir }) => { /* do something */ }
```

## `publishCommand`

*default:*
```js
publishCommand: ({ isYarn, tag, defaultCommand, dir }) => defaultCommand
```

`defaultCommand`:
```js
isYarn
    ? `yarn publish --no-git-tag-version --non-interactive --tag ${tag}`
    : `npm publish --tag ${tag}`
```

By default, `publishCommand` will return either `yarn publish ...` or `npm publish ...`.

### Scoped Package

If your project is a scoped package and you want it to be public, you need to add `--access public` to the publish command. To do so,

```js
publishCommand: ({ isYarn, tag, defaultCommand, dir }) => `${defaultCommand} --access public`
```

### Monorepo

If your project is a monorepo and if you want to use different publish command per package,

```js
publishCommand: ({ isYarn, tag, defaultCommand, dir }) => {
  if (dir.endsWith("/website")) {
    return "npx now";
  } else {
    return defaultCommand;
  }
}
```

## `afterPublish`

*default:* `undefined`

```js
// example
afterPublish: ({ exec, dir, version, releaseTag }) => { /* do something */ }
```

## `testCommandBeforeRelease`

*default:*
```js
testCommandBeforeRelease: ({ isYarn }) => isYarn ? 'yarn test' : 'npm run test'
```

Ship.js runs this command at `shipjs trigger` before publishing the package to make sure if it works correctly.

If you don't have any testing tool and want to skip this step, you can do so like the following:

```js
testCommandBeforeRelease: () => null
```

## `releases`

*default:* `undefined`

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

*default:* `undefined`

```js
// example
appName: 'My Awesome Package'
```

This is used when Ship.js sends message to your Slack channel. If it's `undefined`, Ship.js will take `name` from your `package.json` by default.

## Messaging to Slack

If you configure an environment variable `SLACK_INCOMING_HOOK`, Ship.js will send messages

- when `shipjs prepare` is finished (`prepare`)
- when `shipjs trigger` begins (`releaseStart`)
- when `shipjs trigger` is finished (`releaseSuccess`)

You can specify sender's username:

```js
slack: {
  default: {
    username: 'My Release Bot',
  }
}
```

As described above, there are three phases of Slack messages: `prepare`, `releaseStart` and `releaseSuccess`.

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
  releaseStart: ({
    appName,
    version,
    latestCommitHash,
    latestCommitUrl,
  }) => ({
    pretext: `:rocket: Starting to release *${appName}@${version}*`,
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
  releaseStart: null,
}
```

In this way, Ship.js won't send a message when it starts to release.

When Ship.js loads your `ship.config.js`, it deep-merges `slack` object.

```js
defaultConfig = {
  slack: {
    default: {
      username: 'Ship.js'
    },
    prepared: () => { /* ... */ },
    releaseStart: () => { /* ... */ },
    releaseSuccess: () => { /* ... */ },
  }
}

yourConfig = {
  slack: {
    releaseStart: null,
  }
}

finalConfig = {
  slack: {
    default: {
      username: 'Ship.js'
    },
    prepared: () => { /* ... */ },
    releaseStart: null, // <- only this is affected
    releaseSuccess: () => { /* ... */ },
  }
}
```