import { getCurrentBranch, getPrereleaseId } from 'shipjs-lib';

import {
  getPackagesToPublish,
  getTagForVersion,
  resolvePublishTags,
} from '../../../helper/index.js';
import { exitProcess } from '../../../util/index.js';
import getPublishTags from '../getPublishTags.js';

describe('getPublishTags', () => {
  beforeEach(() => {
    getPrereleaseId.mockImplementation((version) => {
      const match = /-([a-z]+)\./.exec(version);
      return match ? match[1] : null;
    });
    getCurrentBranch.mockImplementation(() => 'master');
    getTagForVersion.mockImplementation(() => 'beta');
    resolvePublishTags.mockImplementation(() => ({
      tag: 'latest',
      prereleaseTag: 'beta',
    }));
  });

  it('derives the channel from the packages to publish', async () => {
    getPackagesToPublish.mockImplementation(() => [
      { name: 'a', version: '5.0.0-beta.1' },
      { name: 'b', version: '3.1.0' },
    ]);
    const result = await getPublishTags({
      config: {},
      version: '0.0.0',
      releaseTag: 'latest',
      dir: '.',
    });
    expect(resolvePublishTags).toHaveBeenCalledWith(
      expect.objectContaining({
        prerelease: { preid: 'beta' },
        branch: 'master',
        releaseTag: 'latest',
      })
    );
    expect(result).toMatchObject({
      prerelease: { preid: 'beta' },
      tag: 'latest',
      prereleaseTag: 'beta',
    });
    expect(exitProcess).not.toHaveBeenCalled();
  });

  it('uses the root version without packages', async () => {
    getPackagesToPublish.mockImplementation(() => []);
    const result = await getPublishTags({
      config: {},
      version: '1.0.0',
      releaseTag: 'latest',
      dir: '.',
    });
    expect(result.prerelease).toBeNull();
  });

  it('refuses more than one channel', async () => {
    getPackagesToPublish.mockImplementation(() => [
      { name: 'a', version: '5.0.0-beta.1' },
      { name: 'b', version: '2.0.0-rc.0' },
    ]);
    await getPublishTags({
      config: {},
      version: '0.0.0',
      releaseTag: 'latest',
      dir: '.',
    });
    expect(exitProcess).toHaveBeenCalledWith(1);
  });
});
