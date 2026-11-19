import { getPrereleaseId } from 'shipjs-lib';
import { vi } from 'vitest';

import { getTagForVersion, resolvePublishTags } from '../resolvePublishTags.js';

describe('resolvePublishTags', () => {
  it('uses a string for every package', () => {
    const getPublishTag = vi.fn(() => 'beta');
    expect(
      resolvePublishTags({
        config: { getPublishTag },
        version: '1.0.0-beta.0',
        releaseTag: 'beta',
        prerelease: { preid: 'beta' },
        branch: 'main',
        packages: [],
      })
    ).toEqual({ tag: 'beta', prereleaseTag: 'beta' });
    expect(getPublishTag).toHaveBeenCalledWith({
      version: '1.0.0-beta.0',
      releaseTag: 'beta',
      prerelease: { preid: 'beta' },
      branch: 'main',
      packages: [],
    });
  });

  it('accepts { tag, prereleaseTag }', () => {
    expect(
      resolvePublishTags({
        config: {
          getPublishTag: () => ({ tag: 'latest', prereleaseTag: 'beta' }),
        },
      })
    ).toEqual({ tag: 'latest', prereleaseTag: 'beta' });
    expect(
      resolvePublishTags({ config: { getPublishTag: () => ({ tag: 'v4' }) } })
    ).toEqual({ tag: 'v4', prereleaseTag: 'v4' });
  });

  it('throws on anything else', () => {
    expect(() =>
      resolvePublishTags({ config: { getPublishTag: () => undefined } })
    ).toThrow(/getPublishTag/);
  });
});

describe('getTagForVersion', () => {
  it('picks the prerelease tag for prerelease versions', () => {
    getPrereleaseId.mockImplementation((version) =>
      version.includes('-beta') ? 'beta' : null
    );
    const tags = { tag: 'latest', prereleaseTag: 'beta' };
    expect(getTagForVersion('5.0.0-beta.0', tags)).toBe('beta');
    expect(getTagForVersion('3.1.0', tags)).toBe('latest');
  });
});
