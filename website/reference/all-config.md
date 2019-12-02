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
({ isYarn }) =>
    isYarn ? 'yarn install --silent' : 'npm install'`
```

## `versionUpdated`

*default:*
```js
({ version, releaseType, dir, exec }) => {}
```

This is a lifecycle hook where you can put additional code after version is updated. You can read [an example here](../guide/useful-config.html#extra-work-on-updating-version).

- version: `x.y.z`
- releaseType: `'major' | 'minor' | 'patch'`
- dir: current working dir
- exec: `shelljs.exec` bound with the `dir`.
   - For example, `exec('yarn some-command')`
   - This is a synchronous function.

## `beforeCommitChanges`

*default:*
```js
({ nextVersion, releaseType, exec, dir }) => {}
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