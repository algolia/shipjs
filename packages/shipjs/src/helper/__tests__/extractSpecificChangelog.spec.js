import extractSpecificChangelog from '../extractSpecificChangelog';
import fs from 'fs';
import path from 'path';

const conventionalChangelogExample = fs
  .readFileSync(path.resolve(__dirname, 'conventional-changelog.md'))
  .toString();

const lernaChangelogExample = fs
  .readFileSync(path.resolve(__dirname, 'lerna-changelog.md'))
  .toString();

describe('extractSpecificChangelog', () => {
  describe('conventional-changelog', () => {
    it('works with #', () => {
      expect(extractSpecificChangelog(conventionalChangelogExample, '0.8.0'))
        .toMatchInlineSnapshot(`
        "# [0.8.0](https://github.com/algolia/shipjs/compare/v0.7.1...v0.8.0) (2019-10-25)

        ### Features

        - **setup:** add \`npx shipjs setup\` ([#361](https://github.com/algolia/shipjs/issues/361)) ([df70f0a](https://github.com/algolia/shipjs/commit/df70f0a))

        "
      `);
    });

    it('works with ##', () => {
      expect(extractSpecificChangelog(conventionalChangelogExample, '0.5.5'))
        .toMatchInlineSnapshot(`
        "## [0.5.5](https://github.com/algolia/shipjs/compare/v0.5.4...v0.5.5) (2019-10-01)

        ### Bug Fixes

        - exit with 0 when there's nothing to release ([#283](https://github.com/algolia/shipjs/issues/283)) ([3ef15fa](https://github.com/algolia/shipjs/commit/3ef15fa))

        "
      `);
    });
  });

  describe('lerna-changelog', () => {
    it('works', () => {
      expect(
        extractSpecificChangelog(lernaChangelogExample, '0.8.2')
      ).toMatchInlineSnapshot(`null`);
    });
  });
});
