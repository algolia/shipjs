import loadConfig, { loadWithUserConfig } from '../loadConfig';
import defaultConfig from '../defaultConfig';
import path from 'path';

const baseConfig = expect.objectContaining({});

const d = dirName => path.resolve(__dirname, dirName);

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
});

describe('loadWithUserConfig', () => {
  it('should merge with defaultConfig', () => {
    const config = loadWithUserConfig({
      versionUpdated() {},
    });
    ['conventionalChangelogArgs'].forEach(key => {
      expect(config[key]).toBe(defaultConfig[key]);
    });
  });

  it('overwrites the children of mergeStrategy', () => {
    const config = loadWithUserConfig({
      mergeStrategy: {
        toSameBranch: undefined,
        toReleaseBranch: undefined,
      },
    });
    const { mergeStrategy } = config;
    expect(mergeStrategy.toSameBranch).toBe(undefined);
    expect(mergeStrategy.toReleaseBranch).toBe(undefined);
  });

  it('gets default children of mergeStrategy', () => {
    const config = loadWithUserConfig({
      mergeStrategy: {},
    });
    const { mergeStrategy } = config;
    expect(mergeStrategy.toSameBranch).toEqual([]);
    expect(mergeStrategy.toReleaseBranch).toEqual({});
  });
});
