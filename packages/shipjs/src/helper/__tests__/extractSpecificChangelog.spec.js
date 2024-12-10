import extractSpecificChangelog from '../extractSpecificChangelog.js';
import fs from 'fs';
import path from 'path';

const shipjsChangelogExample = fs
  .readFileSync(path.resolve(__dirname, 'shipjs-changelog.md'))
  .toString();

const conventionalChangelogExample = fs
  .readFileSync(path.resolve(__dirname, 'conventional-changelog.md'))
  .toString();

const lernaChangelogExample = fs
  .readFileSync(path.resolve(__dirname, 'lerna-changelog.md'))
  .toString();

describe('extractSpecificChangelog', () => {
  describe('conventional-changelog', () => {
    it('works with #', () => {
      expect(
        extractSpecificChangelog({
          changelog: conventionalChangelogExample,
          version: '0.8.0',
        })
      ).toMatchInlineSnapshot(`
        "# [0.8.0](https://github.com/algolia/shipjs/compare/v0.7.1...v0.8.0) (2019-10-25)

        ### Features

        - **setup:** add \`npx shipjs setup\` ([#361](https://github.com/algolia/shipjs/issues/361)) ([df70f0a](https://github.com/algolia/shipjs/commit/df70f0a))

        "
      `);
    });

    it('works with ##', () => {
      expect(
        extractSpecificChangelog({
          changelog: conventionalChangelogExample,
          version: '0.5.5',
        })
      ).toMatchInlineSnapshot(`
        "## [0.5.5](https://github.com/algolia/shipjs/compare/v0.5.4...v0.5.5) (2019-10-01)

        ### Bug Fixes

        - exit with 0 when there's nothing to release ([#283](https://github.com/algolia/shipjs/issues/283)) ([3ef15fa](https://github.com/algolia/shipjs/commit/3ef15fa))

        "
      `);
    });

    it('works with empty result', () => {
      expect(
        extractSpecificChangelog({
          changelog: conventionalChangelogExample,
          version: '0.5.3',
        })
      ).toMatchInlineSnapshot(`
        "## [0.5.3](https://github.com/algolia/shipjs/compare/v0.5.2...v0.5.3) (2019-09-24)

        "
      `);
    });

    it('works with the changelog of Ship.js', () => {
      expect(
        extractSpecificChangelog({
          changelog: shipjsChangelogExample,
          version: '0.11.1',
        })
      ).toMatchInlineSnapshot(`
        "## [0.11.1](https://github.com/algolia/shipjs/compare/v0.11.0...v0.11.1) (2019-12-01)


        ### Bug Fixes

        #### \`prepare\`
        * ask commit range when tag is missing ([#471](https://github.com/algolia/shipjs/issues/471)) ([f659c34](https://github.com/algolia/shipjs/commit/f659c34))
        * clean up remote \`origin-with-token\` after git push ([#479](https://github.com/algolia/shipjs/issues/479)) ([c81d247](https://github.com/algolia/shipjs/commit/c81d247))
        * fetch tags before figuring out next version ([#468](https://github.com/algolia/shipjs/issues/468)) ([045bbc0](https://github.com/algolia/shipjs/commit/045bbc0))
        * update changelog based on commit range ([#473](https://github.com/algolia/shipjs/issues/473)) ([9841f25](https://github.com/algolia/shipjs/commit/9841f25))
        * update PR message with publish command ([#467](https://github.com/algolia/shipjs/issues/467)) ([18cc7e4](https://github.com/algolia/shipjs/commit/18cc7e4))

        #### \`trigger\`
        * skip missing scripts(\`test\` or \`build\`) ([#465](https://github.com/algolia/shipjs/issues/465)) ([51a58a4](https://github.com/algolia/shipjs/commit/51a58a4))

        #### \`setup\`
        * show \`master\` as a default branch when there is no remote yet ([#466](https://github.com/algolia/shipjs/issues/466)) ([f079ba5](https://github.com/algolia/shipjs/commit/f079ba5))



        "
      `);
    });
  });

  describe('lerna-changelog', () => {
    it('works', () => {
      expect(
        extractSpecificChangelog({
          changelog: lernaChangelogExample,
          version: '0.8.2',
        })
      ).toMatchInlineSnapshot(`
        "## v0.8.2 (2018-10-14)

        #### :bug: Bug Fix

        - [#125](https://github.com/lerna/lerna-changelog/pull/125) Fix \`nextVersion\` config handling ([@Turbo87](https://github.com/Turbo87))

        #### :house: Internal

        - [#124](https://github.com/lerna/lerna-changelog/pull/124) yarn: Add \`integrity\` hashes ([@Turbo87](https://github.com/Turbo87))

        #### Committers: 1

        - Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

        "
      `);
    });
  });
});
