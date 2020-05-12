# [0.19.0](https://github.com/algolia/shipjs/compare/v0.18.4...v0.19.0) (2020-05-12)


### Features

* force push to protected branch with explicit config ([#813](https://github.com/algolia/shipjs/issues/813)) ([3647853](https://github.com/algolia/shipjs/commit/364785329d128ff95f4a9b0f31ec83fd5e27f0c7))



## [0.18.4](https://github.com/algolia/shipjs/compare/v0.18.3...v0.18.4) (2020-05-08)


### Bug Fixes

* **actions:** fix ejs syntax ([#801](https://github.com/algolia/shipjs/issues/801)) ([8055a9f](https://github.com/algolia/shipjs/commit/8055a9f5ce7d4d4f6d904dd096e4a244e2676f9d))
* **release:** push to correct branch in toReleaseBranch strategy ([#803](https://github.com/algolia/shipjs/issues/803)) ([1367315](https://github.com/algolia/shipjs/commit/1367315976244289ccb66c8c8d96ee62d421418f))



## [0.18.3](https://github.com/algolia/shipjs/compare/v0.18.2...v0.18.3) (2020-05-04)


### Bug Fixes

* **actions:** add fetch-depth and git fetch ([#778](https://github.com/algolia/shipjs/issues/778)) ([994e4ff](https://github.com/algolia/shipjs/commit/994e4ff8177a6cb7e74a27c2dc0dab03ba512a5c))
* **deps:** update dependency shelljs to v0.8.4 ([#776](https://github.com/algolia/shipjs/issues/776)) ([b70fc24](https://github.com/algolia/shipjs/commit/b70fc244ec3d1f653777e436b1ac3f4ffea0bf6c))
* **release:** skip running publishCommand if nullish ([#793](https://github.com/algolia/shipjs/issues/793)) ([eb62c8d](https://github.com/algolia/shipjs/commit/eb62c8dfa500888587172e796538d12238dc7a10))



## [0.18.2](https://github.com/algolia/shipjs/compare/v0.18.1...v0.18.2) (2020-04-07)


### Bug Fixes

* **prepare:** fix wrong comparison url in the PR summary when getTagName is overridden in ship.config.js ([#753](https://github.com/algolia/shipjs/issues/753)) ([4a40920](https://github.com/algolia/shipjs/commit/4a40920e7874b51b6c324a8a23ae7690c87159fc))



## [0.18.1](https://github.com/algolia/shipjs/compare/v0.18.0...v0.18.1) (2020-04-03)


### Bug Fixes

* **deps:** update dependency prettier to v2 ([#732](https://github.com/algolia/shipjs/issues/732)) ([96d6ff2](https://github.com/algolia/shipjs/commit/96d6ff22214849b7c0c665b3d104b00ded43b38a))
* **prepare:** respect custom tag name when getting a revision range ([#751](https://github.com/algolia/shipjs/issues/751)) ([a1baa93](https://github.com/algolia/shipjs/commit/a1baa93927a11dfe6f96b9c40fc80e9f54f51e32))



# [0.18.0](https://github.com/algolia/shipjs/compare/v0.17.0...v0.18.0) (2020-03-17)


### Bug Fixes

* **setup:** use github-actions[bot] name and email for generated pull requests ([#719](https://github.com/algolia/shipjs/issues/719)) ([ea4571e](https://github.com/algolia/shipjs/commit/ea4571e82cb4199e788c12f9b0db743814e06931))


### Features

* **prepare:** add a new hook `getNextVersion` ([#724](https://github.com/algolia/shipjs/issues/724)) ([21cf827](https://github.com/algolia/shipjs/commit/21cf8273319871e84ddfe4ef3c56333228ce72a7))



# [0.17.0](https://github.com/algolia/shipjs/compare/v0.16.1...v0.17.0) (2020-03-06)

### BREAKING CHANGE

<img src="./assets/breaking-change.png" alt="BREAKING CHANGE" title="BREAKING CHANGE" width=250 height=60 />

This version introduces some breaking changes.

* In your `ship.config.js`, rename `pullRequestReviewer` to `pullRequestReviewers` (which accepts only an array of strings).

* In your `ship.config.js`, rename `pullRequestTeamReviewer` to `pullRequestTeamReviewers` (which accepts only an array of strings).

* `releaseStart` for Slack message has been removed. If you'd like to have it back, please create an issue and let's discuss.

* The default value of `testCommandBeforeRelease` is now `undefined`. It used to be `({ isYarn }) => isYarn ? 'yarn test' : 'npm run test'`. This change assumes many of you already run tests with CI services when you create pull requests. With the previous config, Ship.js unnecessarily ran tests before release. If you'd like to have it back, add some config like the following:

```
testCommandBeforeRelease: ({ isYarn }) => isYarn ? 'yarn test' : 'npm run test',
```


### Bug Fixes

* **setup:** do not write ship.config.js if not necessary ([#705](https://github.com/algolia/shipjs/issues/705)) ([82f8cbc](https://github.com/algolia/shipjs/commit/82f8cbca1ce3b87cf629f83c95202c2cde3f5b49))
* **setup:** fix wrong config(packagesToBump, packagesToPublish) for monorepo ([#701](https://github.com/algolia/shipjs/issues/701)) ([0590a38](https://github.com/algolia/shipjs/commit/0590a384d036ff13586d744b6cadc103dd6ef0da))

* clean up reviewer related configs ([#707](https://github.com/algolia/shipjs/issues/707)) ([833d684](https://github.com/algolia/shipjs/commit/833d684d516bf75bdc3ae62c634ff1c8b7e3340c))
* allow @(a|b|c) syntax for packagesToBump and packagesToPublish ([#702](https://github.com/algolia/shipjs/issues/702)) ([de9083c](https://github.com/algolia/shipjs/commit/de9083c95066bd998c9b0071ddd9bd682f270700))
* remove releaseStart hook for slack message ([#703](https://github.com/algolia/shipjs/issues/703)) ([2a9502b](https://github.com/algolia/shipjs/commit/2a9502b75c94406db7dff3a6779f07215b6731ca))
* create CHANGELOG if missing ([#697](https://github.com/algolia/shipjs/issues/697)) ([72cb4ec](https://github.com/algolia/shipjs/commit/72cb4eca2ad43c4d1d62b8e427233f283d5a0a73))
* empty testCommandBeforeRelease by default ([#696](https://github.com/algolia/shipjs/issues/696)) ([34753b0](https://github.com/algolia/shipjs/commit/34753b061a6f73f6a72218fa703bdf99237cefc7))
* **shipjs-lib:** exclude dependencies from final bundle ([#651](https://github.com/algolia/shipjs/issues/651)) ([f6ec4cf](https://github.com/algolia/shipjs/commit/f6ec4cfff0ae578fff54f7e6f23367839dfb3cc1))
* check nullable value for reviewers ([#709](https://github.com/algolia/shipjs/issues/709)) ([df7c0be](https://github.com/algolia/shipjs/commit/df7c0be8f25655727b52c54b53f997745d3e32fe))



## [0.16.1](https://github.com/algolia/shipjs/compare/v0.16.0...v0.16.1) (2020-03-03)


### Bug Fixes

* **setup:** use .prettierrc if exists ([#681](https://github.com/algolia/shipjs/issues/681)) ([39b93be](https://github.com/algolia/shipjs/commit/39b93be68d371ef3b762e2ee16505170ae758430))



# [0.16.0](https://github.com/algolia/shipjs/compare/v0.15.0...v0.16.0) (2020-02-25)


### Bug Fixes

* detect major versions correctly ([#666](https://github.com/algolia/shipjs/issues/666)) ([5c5cca1](https://github.com/algolia/shipjs/commit/5c5cca180a37a163bef53df28d222c923eab87c2)), closes [#634](https://github.com/algolia/shipjs/issues/634)
* pass version to buildCommand ([#676](https://github.com/algolia/shipjs/issues/676)) ([c25b49b](https://github.com/algolia/shipjs/commit/c25b49b8d8c70d649b04e151e9898515e064fa47))


### Features

* **error:** tell user where to create a GitHub token ([#665](https://github.com/algolia/shipjs/issues/665)) ([901fcd8](https://github.com/algolia/shipjs/commit/901fcd8120acd6f6e59dabb4cdb718fc50fe75cf))



# [0.15.0](https://github.com/algolia/shipjs/compare/v0.14.2...v0.15.0) (2020-02-03)


### Features

* add environment variable `SHIPJS=true` ([#647](https://github.com/algolia/shipjs/issues/647)) ([582df3c](https://github.com/algolia/shipjs/commit/582df3ca459ba3b9bc692dd792552f11f937bd78))
* **prepare:** add `shouldPrepare` ([#654](https://github.com/algolia/shipjs/issues/654)) ([166626d](https://github.com/algolia/shipjs/commit/166626d2ee8c66170943f99c9212ae486bae45f0))

#### `shouldPrepare`
*default*: `undefined`

```js
// example
shouldPrepare: ({
                  commits,
                  nextVersion,
                  releaseType,
                  releaseTag,
                  commitNumbersPerType,
               }) => { /* ... */ }
```

This is a lifecycle hook where you can decide whether or not to proceed with the preparation.

Read [the guide](https://community.algolia.com/shipjs/reference/all-config.html#shouldprepare) to learn more about the hook.


## [0.14.2](https://github.com/algolia/shipjs/compare/v0.14.1...v0.14.2) (2020-01-27)


### Bug Fixes

* add version in buildCommand hook ([#640](https://github.com/algolia/shipjs/issues/640)) ([420dbb9](https://github.com/algolia/shipjs/commit/420dbb9ef381d998a0fcb973e21828cbea6bd8a4))



## [0.14.1](https://github.com/algolia/shipjs/compare/v0.14.0...v0.14.1) (2020-01-22)


### Bug Fixes

* clean up all cases for releaseType ([#631](https://github.com/algolia/shipjs/issues/631)) ([89e5d73](https://github.com/algolia/shipjs/commit/89e5d732d0ac1d4d2a4750703c583ff82c450cfd))
* pass releaseTag to afterPublish hook ([#632](https://github.com/algolia/shipjs/issues/632)) ([6b5febb](https://github.com/algolia/shipjs/commit/6b5febb0d2ab8f6d375a4116a23a5821941271ac))

### `releaseType`

The following shows how `releaseType` is determined.

#### normal cases
- `1.2.3` -> `2.0.0`: `major`
- `1.2.3` -> `1.3.0`: `minor`
- `1.2.3` -> `1.2.4`: `patch`

#### next version has a tag
- `1.2.3` -> `1.2.4-alpha.0`: `prerelease`
- `1.2.4-alpha.0` -> `1.2.4-alpha.1`: `prerelease`

#### version with a tag -> version without one
- `1.2.4-alpha.0` -> `1.2.4`: `patch`
- `1.2.4-alpha.0` -> `1.2.5`: `patch`
- `1.2.4-alpha.0` -> `1.3.0`: `minor`
- `1.2.4-alpha.0` -> `2.0.0`: `major`
- `1.3.0-alpha.0` -> `1.3.0`: `minor`
Just like normal cases, the new version decides the `releaseType`.

# [0.14.0](https://github.com/algolia/shipjs/compare/v0.13.1...v0.14.0) (2020-01-14)


### Bug Fixes

* **release**: add `version` in `afterPublish` hook ([#608](https://github.com/algolia/shipjs/issues/608)) ([76c5591](https://github.com/algolia/shipjs/commit/76c5591c7fe7aa52b1dfab64fa084c96a09a1206))
* **action**: pin GitHub Action versions ([#612](https://github.com/algolia/shipjs/issues/612)) ([b5e576a](https://github.com/algolia/shipjs/commit/b5e576a7d3c904676ec66dfac9e946a234470124))
* **action**: replace switch with build in checkout ([#602](https://github.com/algolia/shipjs/issues/602)) ([ef5f8b9](https://github.com/algolia/shipjs/commit/ef5f8b9ba9571c787b7e4ec7569ed4920f3189d9))
* **slack:** use tag name instead of release tag ([#609](https://github.com/algolia/shipjs/issues/609)) ([f183425](https://github.com/algolia/shipjs/commit/f18342579214ac99be33f71bc6b8f37c52fea8b8))


### Features

* **prepare:** provide a config to assign team as reviewer ([#619](https://github.com/algolia/shipjs/issues/619)) ([14ebf38](https://github.com/algolia/shipjs/commit/14ebf3865954c1ca2b07e03cb02dbe3f06f1f593))



## [0.13.1](https://github.com/algolia/shipjs/compare/v0.13.0...v0.13.1) (2019-12-31)


### Bug Fixes

* **trigger:** fix a bug it threw an exception at `finished` step ([#581](https://github.com/algolia/shipjs/issues/581)) ([eb60e56](https://github.com/algolia/shipjs/commit/eb60e56172841abcec5a46820d978fb19b852e94))



# [0.13.0](https://github.com/algolia/shipjs/compare/v0.12.1...v0.13.0) (2019-12-31)


### Bug Fixes

* **github-actions:** fix image name ([#557](https://github.com/algolia/shipjs/issues/557)) ([33f710c](https://github.com/algolia/shipjs/commit/33f710c36e552eca2d27d290ce1c987955335984))
* replace GH_TOKEN with GITHUB_TOKEN ([#568](https://github.com/algolia/shipjs/issues/568)) ([835e26f](https://github.com/algolia/shipjs/commit/835e26f6d61813b46abd8c028e9b166c351adcab))
* **prepare:** throw with --yes when git tag is missing ([#570](https://github.com/algolia/shipjs/issues/570)) ([cee5f35](https://github.com/algolia/shipjs/commit/cee5f35c1e30b8cc039a7be88a18268ae2bdd75a))


### Features

* **prepare:** add --commit-from option ([#572](https://github.com/algolia/shipjs/issues/572)) ([041d3d9](https://github.com/algolia/shipjs/commit/041d3d9c1f6fc944c3259c702973fbff9721c0a0))
* **release:** notify GitHub release url instead of CHANGELOG ([#555](https://github.com/algolia/shipjs/issues/555)) ([c017067](https://github.com/algolia/shipjs/commit/c0170677d013757c56ca76cea4ce1b2cee45a80a)), closes [#506](https://github.com/algolia/shipjs/issues/506)



## [0.12.1](https://github.com/algolia/shipjs/compare/v0.12.0...v0.12.1) (2019-12-24)


### Bug Fixes

* **setup:** add SLACK_INCOMING_HOOK env for all GitHub Actions ([#550](https://github.com/algolia/shipjs/issues/550)) ([dbdd919](https://github.com/algolia/shipjs/commit/dbdd919479684474f6ab1c4fad10072559ddc25b))
* **setup:** don't use escape for config serializion ([#549](https://github.com/algolia/shipjs/issues/549)) ([59b802d](https://github.com/algolia/shipjs/commit/59b802d8b3118da3ecfc629261e771688cef2b3d))



# [0.12.0](https://github.com/algolia/shipjs/compare/v0.11.3...v0.12.0) (2019-12-20)



### Features

* **setup:** add github actions as CI option ([#502](https://github.com/algolia/shipjs/issues/502)) ([923cc87](https://github.com/algolia/shipjs/commit/923cc8737289bb511ae54bed01868dfb888aa583))



## [0.11.3](https://github.com/algolia/shipjs/compare/v0.11.2...v0.11.3) (2019-12-17)


### Bug Fixes

* drop conventional-changelog-cli and use its node library instead ([#525](https://github.com/algolia/shipjs/issues/525)) ([430c303](https://github.com/algolia/shipjs/commit/430c303b196029a4c249a7bf2c5ac6ed05496f36))



## [0.11.2](https://github.com/algolia/shipjs/compare/v0.11.1...v0.11.2) (2019-12-04)


### Bug Fixes

* **config:** deep merge `config.slack` ([#494](https://github.com/algolia/shipjs/issues/494)) ([efb1704](https://github.com/algolia/shipjs/commit/efb1704f21b7baf6d469a8c5c0591f16cb0c9f61))

#### `prepare`
* add missing pr url to slack message ([#499](https://github.com/algolia/shipjs/issues/499)) ([fa1e654](https://github.com/algolia/shipjs/commit/fa1e65466868b38cf84658ca0511dcc3a8f74b01))
* make `versionUpdated` and `beforeCommitChanges` undefined by default ([#495](https://github.com/algolia/shipjs/issues/495)) ([d9a4c51](https://github.com/algolia/shipjs/commit/d9a4c51a504288082ffbf0ac0094c2eec56bff01))

#### `trigger`
* wrong release content due to wrong regexp ([#484](https://github.com/algolia/shipjs/issues/484)) ([ba9588a](https://github.com/algolia/shipjs/commit/ba9588a941e83fea5cc7ddee64ac31a2d0d753dc))

#### `setup`
* add `--dry-run` flag ([#492](https://github.com/algolia/shipjs/issues/492)) ([1beb810](https://github.com/algolia/shipjs/commit/1beb8102505d21f1ffb7a61cc9efcd247d6a6b13))



## [0.11.1](https://github.com/algolia/shipjs/compare/v0.11.0...v0.11.1) (2019-12-01)


### Bug Fixes

#### `prepare`
* ask commit range when tag is missing ([#471](https://github.com/algolia/shipjs/issues/471)) ([f659c34](https://github.com/algolia/shipjs/commit/f659c34))
* clean up remote `origin-with-token` after git push ([#479](https://github.com/algolia/shipjs/issues/479)) ([c81d247](https://github.com/algolia/shipjs/commit/c81d247))
* fetch tags before figuring out next version ([#468](https://github.com/algolia/shipjs/issues/468)) ([045bbc0](https://github.com/algolia/shipjs/commit/045bbc0))
* update changelog based on commit range ([#473](https://github.com/algolia/shipjs/issues/473)) ([9841f25](https://github.com/algolia/shipjs/commit/9841f25))
* update PR message with publish command ([#467](https://github.com/algolia/shipjs/issues/467)) ([18cc7e4](https://github.com/algolia/shipjs/commit/18cc7e4))

#### `trigger`
* skip missing scripts(`test` or `build`) ([#465](https://github.com/algolia/shipjs/issues/465)) ([51a58a4](https://github.com/algolia/shipjs/commit/51a58a4))

#### `setup`
* show `master` as a default branch when there is no remote yet ([#466](https://github.com/algolia/shipjs/issues/466)) ([f079ba5](https://github.com/algolia/shipjs/commit/f079ba5))



# [0.11.0](https://github.com/algolia/shipjs/compare/v0.10.0...v0.11.0) (2019-11-27)

### NOTICE

From `0.11.0`, `GITHUB_TOKEN` is required as an environment variable for Ship.js to work.

Please refer to [the guide](https://community.algolia.com/shipjs/guide/getting-started.html#github-token).

### Bug Fixes

* check if origin-with-token already exists on prepare command ([#455](https://github.com/algolia/shipjs/issues/455)) ([ce296a6](https://github.com/algolia/shipjs/commit/ce296a6))
* create github release with rest api instead of hub ([#458](https://github.com/algolia/shipjs/issues/458)) ([0bfeda6](https://github.com/algolia/shipjs/commit/0bfeda6))
* create pull request with rest api instead of hub ([#456](https://github.com/algolia/shipjs/issues/456)) ([9423f11](https://github.com/algolia/shipjs/commit/9423f11))
* guide users to have GITHUB_TOKEN ([#460](https://github.com/algolia/shipjs/issues/460)) ([b3ae436](https://github.com/algolia/shipjs/commit/b3ae436))
* remove hub ([#459](https://github.com/algolia/shipjs/issues/459)) ([cfd4b2f](https://github.com/algolia/shipjs/commit/cfd4b2f))


### Features

* add support for scoped packages ([#451](https://github.com/algolia/shipjs/issues/451)) ([765cade](https://github.com/algolia/shipjs/commit/765cade))



# [0.10.0](https://github.com/algolia/shipjs/compare/v0.9.0...v0.10.0) (2019-11-26)


### Bug Fixes

* deprecate --first-release and --release-count at shipjs prepare ([#447](https://github.com/algolia/shipjs/issues/447)) ([d46d83f](https://github.com/algolia/shipjs/commit/d46d83f))
* pin dependency at shipjs setup ([#446](https://github.com/algolia/shipjs/issues/446)) ([6560b9f](https://github.com/algolia/shipjs/commit/6560b9f))
* **getChangelog:** wrong argument name ([#448](https://github.com/algolia/shipjs/issues/448)) ([e378e06](https://github.com/algolia/shipjs/commit/e378e06))


### Features

* **releaseType:** expose at hooks ("major", "minor", ...) ([#441](https://github.com/algolia/shipjs/issues/441)) ([c855dbd](https://github.com/algolia/shipjs/commit/c855dbd))



# [0.9.0](https://github.com/algolia/shipjs/compare/v0.8.2...v0.9.0) (2019-11-25)


### Bug Fixes

* update path to conventional-changelog binary ([#425](https://github.com/algolia/shipjs/issues/425)) ([75d9994](https://github.com/algolia/shipjs/commit/75d9994))


### Features

* add extractChangelog to config ([#403](https://github.com/algolia/shipjs/issues/403)) ([35605ec](https://github.com/algolia/shipjs/commit/35605ec))



## [0.8.2](https://github.com/algolia/shipjs/compare/v0.8.1...v0.8.2) (2019-11-08)


### Bug Fixes

* continue release even if there's no conventional commit ([#405](https://github.com/algolia/shipjs/issues/405)) ([70fb2ec](https://github.com/algolia/shipjs/commit/70fb2ec))
* fix hubConfigured for GitHub Actions ([#393](https://github.com/algolia/shipjs/issues/393)) ([635ab7b](https://github.com/algolia/shipjs/commit/635ab7b))



## [0.8.1](https://github.com/algolia/shipjs/compare/v0.8.0...v0.8.1) (2019-11-05)


### Bug Fixes

* extract changelog for lerna-changelog ([#388](https://github.com/algolia/shipjs/issues/388)) ([08ae7d5](https://github.com/algolia/shipjs/commit/08ae7d5))
* pass `nextVersion` to `beforeCommitChanges` ([#389](https://github.com/algolia/shipjs/issues/389)) ([903f569](https://github.com/algolia/shipjs/commit/903f569))
* fix detecting yarn ([#381](https://github.com/algolia/shipjs/pull/381)) ([7aa393a](https://github.com/algolia/shipjs/commit/7aa393a))



# [0.8.0](https://github.com/algolia/shipjs/compare/v0.7.1...v0.8.0) (2019-10-25)

### Features

- **setup:** add `npx shipjs setup` ([#361](https://github.com/algolia/shipjs/issues/361)) ([df70f0a](https://github.com/algolia/shipjs/commit/df70f0a))

## [0.7.1](https://github.com/algolia/shipjs/compare/v0.7.0...v0.7.1) (2019-10-21)

### Bug Fixes

- skip creating a release at github when hub cli is not found ([#353](https://github.com/algolia/shipjs/issues/353)) ([c408a00](https://github.com/algolia/shipjs/commit/c408a00))

# [0.7.0](https://github.com/algolia/shipjs/compare/v0.6.0...v0.7.0) (2019-10-21)

### Bug Fixes

- accept an array for pullRequestReviewer ([#314](https://github.com/algolia/shipjs/issues/314)) ([c26a07f](https://github.com/algolia/shipjs/commit/c26a07f))
- add option to run not to print command ([#321](https://github.com/algolia/shipjs/issues/321)) ([bc328e6](https://github.com/algolia/shipjs/commit/bc328e6))
- do not print github token ([#322](https://github.com/algolia/shipjs/issues/322)) ([82527cf](https://github.com/algolia/shipjs/commit/82527cf))
- fix exception on dry mode ([#313](https://github.com/algolia/shipjs/issues/313)) ([2c4a2e4](https://github.com/algolia/shipjs/commit/2c4a2e4))
- get PR number correctly after preparation ([#340](https://github.com/algolia/shipjs/issues/340)) ([4ce3443](https://github.com/algolia/shipjs/commit/4ce3443))

### Features

- create GitHub releases ([#311](https://github.com/algolia/shipjs/issues/311)) ([f1e4e77](https://github.com/algolia/shipjs/commit/f1e4e77))
  - This is automatically done and uses the changelog as content of release.
- upload assets to GitHub release ([#334](https://github.com/algolia/shipjs/issues/334)) ([fcf2807](https://github.com/algolia/shipjs/commit/fcf2807))
  - At `ship.config.js`, You can configure `releaeses.assetsToUpload`. More details in configuration will come soon.

### BREAKING CHANGE

<img src="./assets/breaking-change.png" alt="BREAKING CHANGE" title="BREAKING CHANGE" width=250 height=60 />

It's a breaking change but haven't bumped the major version since it's still in beta.

Please bear with any inconvenience.

- replace `monorepo.readVersionFrom` with `monorepo.mainVersionFile` ([#350](https://github.com/algolia/shipjs/issues/350)) ([107255a](https://github.com/algolia/shipjs/commit/107255a)), ([#351](https://github.com/algolia/shipjs/issues/351)) ([98617b4](https://github.com/algolia/shipjs/commit/98617b4))
  - Now Ship.js updates the version at `monorepo.mainVersionFile`. With `monorepo.readVersionFrom`, it didn't update the file itself.

# [0.6.0](https://github.com/algolia/shipjs/compare/v0.5.5...v0.6.0) (2019-10-04)

### Bug Fixes

- don't display steps for slack when there's no slack config ([#294](https://github.com/algolia/shipjs/issues/294)) ([eb1ab44](https://github.com/algolia/shipjs/commit/eb1ab44))
- fix pull request url in slack message ([#301](https://github.com/algolia/shipjs/issues/301)) ([f89ba1d](https://github.com/algolia/shipjs/commit/f89ba1d))

### Features

- add beforePublish and afterPublish hook ([#293](https://github.com/algolia/shipjs/issues/293)) ([0de5d68](https://github.com/algolia/shipjs/commit/0de5d68))

## [0.5.5](https://github.com/algolia/shipjs/compare/v0.5.4...v0.5.5) (2019-10-01)

### Bug Fixes

- exit with 0 when there's nothing to release ([#283](https://github.com/algolia/shipjs/issues/283)) ([3ef15fa](https://github.com/algolia/shipjs/commit/3ef15fa))

## [0.5.4](https://github.com/algolia/shipjs/compare/v0.5.3...v0.5.4) (2019-09-25)

## [0.5.3](https://github.com/algolia/shipjs/compare/v0.5.2...v0.5.3) (2019-09-24)

## [0.5.2](https://github.com/algolia/shipjs/compare/v0.5.1...v0.5.2) (2019-09-24)

### Bug Fixes

- change formatCommitMessage and introduce formatPullRequestTitle ([#270](https://github.com/algolia/shipjs/issues/270)) ([f21e167](https://github.com/algolia/shipjs/commit/f21e167))

# [0.5.0](https://github.com/algolia/shipjs/compare/v0.4.0...v0.5.0) (2019-09-08)

### Bug Fixes

- add monorepo config ([#246](https://github.com/algolia/shipjs/issues/246)) ([744cfc4](https://github.com/algolia/shipjs/commit/744cfc4))
- fix a bug where it couldn't check correctly if hub is configured ([#241](https://github.com/algolia/shipjs/issues/241)) ([c228772](https://github.com/algolia/shipjs/commit/c228772))
- git push with upstream specified ([#206](https://github.com/algolia/shipjs/issues/206)) ([ef5eccd](https://github.com/algolia/shipjs/commit/ef5eccd))
- print error message when hub doesn't exist ([#205](https://github.com/algolia/shipjs/issues/205)) ([9ba45ff](https://github.com/algolia/shipjs/commit/9ba45ff))
- push to git with GITHUB_TOKEN ([#234](https://github.com/algolia/shipjs/issues/234)) ([a39e7ee](https://github.com/algolia/shipjs/commit/a39e7ee))
- rename release command to trigger ([#236](https://github.com/algolia/shipjs/issues/236)) ([3cbedb2](https://github.com/algolia/shipjs/commit/3cbedb2))
- throw when hub is installed but not configured ([#208](https://github.com/algolia/shipjs/issues/208)) ([a4c769c](https://github.com/algolia/shipjs/commit/a4c769c))

### Features

- add monorepo support ([#232](https://github.com/algolia/shipjs/issues/232)) ([aa96ca9](https://github.com/algolia/shipjs/commit/aa96ca9))
- add tag at NPM when it's prerelease like beta, rc, ... ([#212](https://github.com/algolia/shipjs/issues/212)) ([91ba961](https://github.com/algolia/shipjs/commit/91ba961))
- rename packageJsons to filesToBump ([#209](https://github.com/algolia/shipjs/issues/209)) ([5753300](https://github.com/algolia/shipjs/commit/5753300))

# [0.4.0](https://github.com/algolia/shipjs/compare/v0.3.4...v0.4.0) (2019-08-20)

### Bug Fixes

- fix --no-browse option ([#195](https://github.com/algolia/shipjs/issues/195)) ([f923e52](https://github.com/algolia/shipjs/commit/f923e52))
- skip notification when args not given ([#199](https://github.com/algolia/shipjs/issues/199)) ([b0be6bf](https://github.com/algolia/shipjs/commit/b0be6bf))

### Features

- accept slack incoming hook from ENV ([#200](https://github.com/algolia/shipjs/issues/200)) ([f941bd7](https://github.com/algolia/shipjs/commit/f941bd7))
- add notification for prepare ([#198](https://github.com/algolia/shipjs/issues/198)) ([c0388cb](https://github.com/algolia/shipjs/commit/c0388cb))

## [0.3.4](https://github.com/algolia/shipjs/compare/v0.3.3...v0.3.4) (2019-08-20)

## [0.3.2](https://github.com/algolia/shipjs/compare/v0.3.1...v0.3.2) (2019-08-18)

### Bug Fixes

- add missing message on dry-mode ([#178](https://github.com/algolia/shipjs/issues/178)) ([3922854](https://github.com/algolia/shipjs/commit/3922854))
- fix wrong command for git push ([#182](https://github.com/algolia/shipjs/issues/182)) ([d2b2e4a](https://github.com/algolia/shipjs/commit/d2b2e4a))

## [0.3.1](https://github.com/algolia/shipjs/compare/v0.3.0...v0.3.1) (2019-08-17)

### Bug Fixes

- ignore commits out of convention instead of throwing ([#176](https://github.com/algolia/shipjs/issues/176)) ([b6fc850](https://github.com/algolia/shipjs/commit/b6fc850))

# [0.3.0](https://github.com/algolia/shipjs/compare/v0.2.0...v0.3.0) (2019-08-17)

### Bug Fixes

- **deps:** update dependency inquirer to v6.5.1 ([#154](https://github.com/algolia/shipjs/issues/154)) ([040d722](https://github.com/algolia/shipjs/commit/040d722))

### Features

- add --no-browse option ([#151](https://github.com/algolia/shipjs/issues/151)) ([609a955](https://github.com/algolia/shipjs/commit/609a955))

# [0.2.0](https://github.com/algolia/shipjs/compare/v0.1.1...v0.2.0) (2019-08-07)

### Bug Fixes

- exit with non-zero if failed ([#138](https://github.com/algolia/shipjs/issues/138)) ([64e9626](https://github.com/algolia/shipjs/commit/64e9626))

### Features

- **reviewer:** add config to assign reviewer when creating PR ([#139](https://github.com/algolia/shipjs/issues/139)) ([4b7b74f](https://github.com/algolia/shipjs/commit/4b7b74f))

# 0.1.0 (2019-08-02)

### Initial Release
