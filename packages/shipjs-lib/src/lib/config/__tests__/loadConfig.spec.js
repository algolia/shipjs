import loadConfig from '../loadConfig';
import defaultConfig from '../defaultConfig';
import path from 'path';

const baseConfig = expect.objectContaining({});

const d = (dirName) => path.resolve(__dirname, dirName);

describe('loadConfig', () => {
  it('does not throw when there is no config', () => {
    expect(loadConfig(d('non-existing-dir'))).toMatchObject(baseConfig);
  });

  it('should load config', () => {
    expect(loadConfig(d('example'))).toMatchObject(baseConfig);
  });

  it('should get function properly', () => {
    const config = loadConfig(d('example'));
    expect(typeof config.versionUpdated).toBe('function');
  });

  it('should merge defaultConfig and userConfig', () => {
    const config = loadConfig(d('example'));
    expect(config.conventionalChangelogArgs).toBe(
      defaultConfig.conventionalChangelogArgs
    );
  });
});
