import loadConfig from '../loadConfig.js';
import defaultConfig from '../defaultConfig.js';
import path from 'path';

const baseConfig = expect.objectContaining({});

const d = (dirName) => path.resolve(__dirname, dirName);

describe('loadConfig', () => {
  it('does not throw when there is no config', async () => {
    expect(await loadConfig(d('non-existing-dir'))).toMatchObject(baseConfig);
  });

  it('should load config', async () => {
    expect(await loadConfig(d('example'))).toMatchObject(baseConfig);
  });

  it('should load config with cjs ext', async () => {
    const config = await loadConfig(d('cjs'));
    expect(typeof config.versionUpdated).toBe('function');
  });

  it('should get function properly', async () => {
    const config = await loadConfig(d('example'));
    expect(typeof config.versionUpdated).toBe('function');
  });

  it('should merge defaultConfig and userConfig', async () => {
    const config = await loadConfig(d('example'));
    expect(config.conventionalChangelogArgs).toBe(
      defaultConfig.conventionalChangelogArgs
    );
  });
});
