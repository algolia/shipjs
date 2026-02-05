import path from 'path';

import tempWrite from 'temp-write';
import { vi } from 'vitest';

import { parseArgs } from '../../../util/index.js';
import { prepareParams } from '../updateChangelog.js';

describe('prepareParams', () => {
  it('parses --config option as file path', async () => {
    const actualUtil = await vi.importActual('../../../util/index.js');
    parseArgs.mockImplementation(actualUtil.parseArgs);
    const config = {
      writerOpts: {
        headerPartial: '## {{version}}',
      },
    };
    const configString = `module.exports = ${JSON.stringify(config)};`;
    const configPath = tempWrite.sync(configString);
    const configDir = path.basename(path.dirname(configPath));

    const { args } = await prepareParams({
      dir: configDir,
      conventionalChangelogArgs: `-i CHANGELOG.md -s --config ${configPath}`,
      revisionRange: '1.0.0..1.0.1',
    });
    // Config path is stored, actual loading happens in runConventionalChangelog
    expect(args.config).toBe(configPath);
  });

  it('parses revision range into gitCommitsParams', async () => {
    const actualUtil = await vi.importActual('../../../util/index.js');
    parseArgs.mockImplementation(actualUtil.parseArgs);

    const { gitCommitsParams } = await prepareParams({
      dir: '/tmp',
      conventionalChangelogArgs: '-i CHANGELOG.md -s',
      revisionRange: 'v1.0.0..HEAD',
    });

    expect(gitCommitsParams).toEqual({ from: 'v1.0.0', to: 'HEAD' });
  });
});
