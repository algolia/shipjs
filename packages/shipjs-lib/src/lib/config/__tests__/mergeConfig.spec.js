import mergeConfig from '../mergeConfig.js';

describe('mergeConfig', () => {
  it('deepmerge', () => {
    const config = mergeConfig(
      {
        slack: {
          default: {
            username: 'Ship.js',
          },
          prepared: () => {},
          releaseSuccess: () => {},
        },
      },
      {
        slack: {
          default: {
            username: 'Release',
          },
        },
      }
    );
    expect(config.slack.default.username).toEqual('Release');
    expect(config.slack.prepared).toBeInstanceOf(Function);
    expect(config.slack.releaseSuccess).toBeInstanceOf(Function);
  });

  it('deepmerge (2)', () => {
    const config = mergeConfig(
      {
        slack: {
          default: {
            username: 'Ship.js',
          },
          prepared: () => {},
          releaseSuccess: () => {},
        },
      },
      {
        slack: {
          releaseSuccess: null,
        },
      }
    );
    expect(config.slack.default.username).toEqual('Ship.js');
    expect(config.slack.prepared).toBeInstanceOf(Function);
    expect(config.slack.releaseSuccess).toBeNull();
  });
});
