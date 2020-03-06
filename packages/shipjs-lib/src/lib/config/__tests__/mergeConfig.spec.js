import mergeConfig from '../mergeConfig';

describe('mergeConfig', () => {
  it('overwrites the children of mergeStrategy', () => {
    const config = mergeConfig(
      {
        mergeStrategy: {
          toSameBranch: ['master'],
        },
      },
      {
        mergeStrategy: {
          toSameBranch: undefined,
          toReleaseBranch: undefined,
        },
      }
    );
    const { mergeStrategy } = config;
    expect(mergeStrategy.toSameBranch).toBe(undefined);
    expect(mergeStrategy.toReleaseBranch).toBe(undefined);
  });

  it('gets default children of mergeStrategy', () => {
    const config = mergeConfig(
      {
        mergeStrategy: {
          toSameBranch: ['master'],
        },
      },
      {
        mergeStrategy: {},
      }
    );
    const { mergeStrategy } = config;
    expect(mergeStrategy.toSameBranch).toEqual([]);
    expect(mergeStrategy.toReleaseBranch).toEqual({});
  });

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
