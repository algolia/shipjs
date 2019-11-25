# [0.9.0](https://github.com/algolia/shipjs/compare/v0.8.2...v0.9.0) (2019-11-25)


### Bug Fixes

* **deps:** update dependency arg to v4.1.2 ([#444](https://github.com/algolia/shipjs/issues/444)) ([d928436](https://github.com/algolia/shipjs/commit/d928436))
* **deps:** update dependency chalk to v3 ([#408](https://github.com/algolia/shipjs/issues/408)) ([487040d](https://github.com/algolia/shipjs/commit/487040d))
* **deps:** update dependency conventional-changelog-cli to v2.0.27 ([#413](https://github.com/algolia/shipjs/issues/413)) ([339e1ad](https://github.com/algolia/shipjs/commit/339e1ad))
* **deps:** update dependency conventional-changelog-cli to v2.0.28 ([#419](https://github.com/algolia/shipjs/issues/419)) ([2d4334d](https://github.com/algolia/shipjs/commit/2d4334d))
* **deps:** update dependency ejs to v3 ([#440](https://github.com/algolia/shipjs/issues/440)) ([2a3f875](https://github.com/algolia/shipjs/commit/2a3f875))


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
