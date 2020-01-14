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

### BREAKING CHANGES

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
