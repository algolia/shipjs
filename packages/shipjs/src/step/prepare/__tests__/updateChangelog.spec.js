const path = require('path');
import { prepareParams } from '../updateChangelog';
import tempWrite from 'temp-write';

describe('prepareParams', () => {
  it('loads configuration from --config option', () => {
    const config = {
      writerOpts: {
        headerPartial: '## {{version}}',
      },
    };
    const configString = `module.exports = { ${config} };`;
    const configPath = tempWrite.sync(configString);
    const configDir = path.basename(path.dirname(configPath));

    const { args } = prepareParams({
      dir: configDir,
      conventionalChangelogArgs: `--config ${configPath}`,
      revisionRange: '1.0.0..1.0.1',
      reject: () => {},
    });
    expect(args.config).toMatch(config);
  });
});
