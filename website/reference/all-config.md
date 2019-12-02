# All Configurations

## `monorepo`

`default: undefined`

```js
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

`default: true`

If `false`, Ship.js won't run `conventional-changelog` during `shipjs prepare`.

## `conventionalChangelogArgs`

`default: '-p angular -i CHANGELOG.md -s'`

This is passed to `conventional-changelog` CLI to update CHANGELOG.md.