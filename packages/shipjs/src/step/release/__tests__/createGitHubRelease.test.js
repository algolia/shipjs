import fs from 'fs';
import path from 'path';

import defaultConfig from 'shipjs-lib/src/lib/config/defaultConfig';

let stdout = '';
const mockedLog = (...args) => {
  stdout += args.join(' ');
  stdout += '\n';
};

beforeEach(() => {
  console.log = mockedLog;
});

afterEach(() => {
  stdout = '';
});

it('create github release', async () => {
  const createGitHubRelease = require('../createGitHubRelease');
  const dryRun = true;
  const dir = path.resolve(__dirname, 'fixtures');
  const version = '0.5.5';
  const config = {
    ...defaultConfig,
    releases: {
      assetsToUpload: 'asset with spaces.md',
    },
  };
  await createGitHubRelease.default({ version, dryRun, config, dir });
  const changelogPath = stdout.match(/-F ([^\s]+)/)[1];
  const changelog = fs.readFileSync(changelogPath, 'utf-8');

  expect(changelog).toEqual(`${version}

## [${version}](https://example.com) (2019-10-01)


### Bug Fixes

- bug fixes


`);

  expect(stdout).toContain(
    `-a '${path.join(dir, config.releases.assetsToUpload)}'`
  );
});
