import loadConfig from '../loadConfig';
import defaultConfig from '../defaultConfig';

const baseConfig = expect.objectContaining({
  baseBranches: expect.any(Array),
});

describe('loadConfig', () => {
  it('does not throw when there is no config', () => {
    expect(loadConfig('non-existing-dir')).toMatchObject(baseConfig);
  });

  it('should load config', () => {
    expect(loadConfig('test')).toMatchObject(baseConfig);
  });

  it('should get function properly', () => {
    const config = loadConfig('test');
    expect(typeof config.versionUpdated).toBe('function');
  });

  it('should merge with defaultConfig', () => {
    const config = loadConfig('test', 'ship2.config.js');
    expect(config.baseBranches).toBe(defaultConfig.baseBranches);
  });
});
