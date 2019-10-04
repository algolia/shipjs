# [0.6.0](https://github.com/algolia/shipjs/compare/v0.5.5...v0.6.0) (2019-10-04)


### Bug Fixes

* don't display steps for slack when there's no slack config ([#294](https://github.com/algolia/shipjs/issues/294)) ([eb1ab44](https://github.com/algolia/shipjs/commit/eb1ab44))
* fix pull request url in slack message ([#301](https://github.com/algolia/shipjs/issues/301)) ([f89ba1d](https://github.com/algolia/shipjs/commit/f89ba1d))


### Features

* add beforePublish and afterPublish hook ([#293](https://github.com/algolia/shipjs/issues/293)) ([0de5d68](https://github.com/algolia/shipjs/commit/0de5d68))



## [0.5.5](https://github.com/algolia/shipjs/compare/v0.5.4...v0.5.5) (2019-10-01)


### Bug Fixes

* exit with 0 when there's nothing to release ([#283](https://github.com/algolia/shipjs/issues/283)) ([3ef15fa](https://github.com/algolia/shipjs/commit/3ef15fa))



## [0.5.4](https://github.com/algolia/shipjs/compare/v0.5.3...v0.5.4) (2019-09-25)



## [0.5.3](https://github.com/algolia/shipjs/compare/v0.5.2...v0.5.3) (2019-09-24)



## [0.5.2](https://github.com/algolia/shipjs/compare/v0.5.1...v0.5.2) (2019-09-24)


### Bug Fixes

* change formatCommitMessage and introduce formatPullRequestTitle ([#270](https://github.com/algolia/shipjs/issues/270)) ([f21e167](https://github.com/algolia/shipjs/commit/f21e167))



# [0.5.0](https://github.com/algolia/shipjs/compare/v0.4.0...v0.5.0) (2019-09-08)


### Bug Fixes

* add monorepo config ([#246](https://github.com/algolia/shipjs/issues/246)) ([744cfc4](https://github.com/algolia/shipjs/commit/744cfc4))
* fix a bug where it couldn't check correctly if hub is configured ([#241](https://github.com/algolia/shipjs/issues/241)) ([c228772](https://github.com/algolia/shipjs/commit/c228772))
* git push with upstream specified ([#206](https://github.com/algolia/shipjs/issues/206)) ([ef5eccd](https://github.com/algolia/shipjs/commit/ef5eccd))
* print error message when hub doesn't exist ([#205](https://github.com/algolia/shipjs/issues/205)) ([9ba45ff](https://github.com/algolia/shipjs/commit/9ba45ff))
* push to git with GITHUB_TOKEN ([#234](https://github.com/algolia/shipjs/issues/234)) ([a39e7ee](https://github.com/algolia/shipjs/commit/a39e7ee))
* rename release command to trigger ([#236](https://github.com/algolia/shipjs/issues/236)) ([3cbedb2](https://github.com/algolia/shipjs/commit/3cbedb2))
* throw when hub is installed but not configured ([#208](https://github.com/algolia/shipjs/issues/208)) ([a4c769c](https://github.com/algolia/shipjs/commit/a4c769c))


### Features

* add monorepo support ([#232](https://github.com/algolia/shipjs/issues/232)) ([aa96ca9](https://github.com/algolia/shipjs/commit/aa96ca9))
* add tag at NPM when it's prerelease like beta, rc, ... ([#212](https://github.com/algolia/shipjs/issues/212)) ([91ba961](https://github.com/algolia/shipjs/commit/91ba961))
* rename packageJsons to filesToBump ([#209](https://github.com/algolia/shipjs/issues/209)) ([5753300](https://github.com/algolia/shipjs/commit/5753300))



# [0.4.0](https://github.com/algolia/shipjs/compare/v0.3.4...v0.4.0) (2019-08-20)


### Bug Fixes

* fix --no-browse option ([#195](https://github.com/algolia/shipjs/issues/195)) ([f923e52](https://github.com/algolia/shipjs/commit/f923e52))
* skip notification when args not given ([#199](https://github.com/algolia/shipjs/issues/199)) ([b0be6bf](https://github.com/algolia/shipjs/commit/b0be6bf))


### Features

* accept slack incoming hook from ENV ([#200](https://github.com/algolia/shipjs/issues/200)) ([f941bd7](https://github.com/algolia/shipjs/commit/f941bd7))
* add notification for prepare ([#198](https://github.com/algolia/shipjs/issues/198)) ([c0388cb](https://github.com/algolia/shipjs/commit/c0388cb))



## [0.3.4](https://github.com/algolia/shipjs/compare/v0.3.3...v0.3.4) (2019-08-20)



## [0.3.2](https://github.com/algolia/shipjs/compare/v0.3.1...v0.3.2) (2019-08-18)


### Bug Fixes

* add missing message on dry-mode ([#178](https://github.com/algolia/shipjs/issues/178)) ([3922854](https://github.com/algolia/shipjs/commit/3922854))
* fix wrong command for git push ([#182](https://github.com/algolia/shipjs/issues/182)) ([d2b2e4a](https://github.com/algolia/shipjs/commit/d2b2e4a))



## [0.3.1](https://github.com/algolia/shipjs/compare/v0.3.0...v0.3.1) (2019-08-17)


### Bug Fixes

* ignore commits out of convention instead of throwing ([#176](https://github.com/algolia/shipjs/issues/176)) ([b6fc850](https://github.com/algolia/shipjs/commit/b6fc850))



# [0.3.0](https://github.com/algolia/shipjs/compare/v0.2.0...v0.3.0) (2019-08-17)


### Bug Fixes

* **deps:** update dependency inquirer to v6.5.1 ([#154](https://github.com/algolia/shipjs/issues/154)) ([040d722](https://github.com/algolia/shipjs/commit/040d722))


### Features

* add --no-browse option ([#151](https://github.com/algolia/shipjs/issues/151)) ([609a955](https://github.com/algolia/shipjs/commit/609a955))



# [0.2.0](https://github.com/algolia/shipjs/compare/v0.1.1...v0.2.0) (2019-08-07)


### Bug Fixes

* exit with non-zero if failed ([#138](https://github.com/algolia/shipjs/issues/138)) ([64e9626](https://github.com/algolia/shipjs/commit/64e9626))


### Features

* **reviewer:** add config to assign reviewer when creating PR ([#139](https://github.com/algolia/shipjs/issues/139)) ([4b7b74f](https://github.com/algolia/shipjs/commit/4b7b74f))


# 0.1.0 (2019-08-02)

### Initial Release
