import { Octokit } from '@octokit/rest';
import { globby } from 'globby';
import { getRepoInfo } from 'shipjs-lib';
import { vi } from 'vitest';

import createGitHubRelease from '../createGitHubRelease.js';

vi.mock('temp-write');
vi.mock('@octokit/rest');
vi.mock('globby', () => ({
  globby: vi.fn(),
}));
vi.mock('shipjs-lib');
vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn(),
    statSync: vi.fn(() => ({ size: 1024 })),
  },
}));

const getDefaultParams = ({
  assetsToUpload,
  extractChangelog = () => null,
} = {}) => ({
  version: '1.2.3',
  config: {
    getTagName: () => 'v1.2.3',
    releases: { assetsToUpload, extractChangelog },
    updateChangelog: false,
  },
  dir: '.',
  dryRun: false,
});

const createRelease = vi.fn();
const uploadReleaseAsset = vi.fn();

describe('createGitHubRelease', () => {
  beforeEach(() => {
    createRelease.mockImplementation(() => ({
      data: {
        id: 'releaseId',
      },
    }));

    Octokit.mockImplementation(function () {
      this.repos = { createRelease, uploadReleaseAsset };
    });

    getRepoInfo.mockImplementation(() => ({
      owner: 'my',
      name: 'repo',
    }));
    globby.mockImplementation((path) => Promise.resolve([path]));
  });

  it('works without assets', async () => {
    await createGitHubRelease(getDefaultParams());
    expect(createRelease).toHaveBeenCalledTimes(1);
    expect(createRelease.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "body": "",
          "name": "v1.2.3",
          "owner": "my",
          "repo": "repo",
          "tag_name": "v1.2.3",
        },
      ]
    `);
    expect(uploadReleaseAsset).toHaveBeenCalledTimes(0);
  });

  it('works with assets (fn)', async () => {
    await createGitHubRelease(
      getDefaultParams({
        assetsToUpload: () => {
          return Promise.resolve(['/path1', '/path2']);
        },
      })
    );
    expect(createRelease).toHaveBeenCalledTimes(1);
    expect(createRelease.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "body": "",
          "name": "v1.2.3",
          "owner": "my",
          "repo": "repo",
          "tag_name": "v1.2.3",
        },
      ]
    `);
    expect(uploadReleaseAsset).toHaveBeenCalledTimes(2);
    expect(uploadReleaseAsset.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "data": undefined,
            "name": "path1",
            "owner": "my",
            "release_id": "releaseId",
            "repo": "repo",
          },
        ],
        [
          {
            "data": undefined,
            "name": "path2",
            "owner": "my",
            "release_id": "releaseId",
            "repo": "repo",
          },
        ],
      ]
    `);
  });

  it('works with assets (list)', async () => {
    await createGitHubRelease(
      getDefaultParams({
        assetsToUpload: ['/path1', '/path2'],
      })
    );
    expect(createRelease).toHaveBeenCalledTimes(1);
    expect(createRelease.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "body": "",
          "name": "v1.2.3",
          "owner": "my",
          "repo": "repo",
          "tag_name": "v1.2.3",
        },
      ]
    `);
    expect(uploadReleaseAsset).toHaveBeenCalledTimes(2);
    expect(uploadReleaseAsset.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "data": undefined,
            "name": "path1",
            "owner": "my",
            "release_id": "releaseId",
            "repo": "repo",
          },
        ],
        [
          {
            "data": undefined,
            "name": "path2",
            "owner": "my",
            "release_id": "releaseId",
            "repo": "repo",
          },
        ],
      ]
    `);
  });

  it('works with assets (string)', async () => {
    await createGitHubRelease(
      getDefaultParams({
        assetsToUpload: '/path1',
      })
    );
    expect(createRelease).toHaveBeenCalledTimes(1);
    expect(createRelease.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "body": "",
          "name": "v1.2.3",
          "owner": "my",
          "repo": "repo",
          "tag_name": "v1.2.3",
        },
      ]
    `);
    expect(uploadReleaseAsset).toHaveBeenCalledTimes(1);
    expect(uploadReleaseAsset.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "data": undefined,
            "name": "path1",
            "owner": "my",
            "release_id": "releaseId",
            "repo": "repo",
          },
        ],
      ]
    `);
  });

  it('works with extractChangelog', async () => {
    const mockExtractChangelog = vi
      .fn()
      .mockImplementation(({ version, dir }) => `# v${version} (${dir})`);
    await createGitHubRelease(
      getDefaultParams({
        extractChangelog: mockExtractChangelog,
      })
    );
    expect(mockExtractChangelog).toHaveBeenCalledWith({
      tagName: 'v1.2.3',
      version: '1.2.3',
      dir: '.',
    });
    expect(createRelease).toHaveBeenCalledTimes(1);
    expect(createRelease.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "body": "# v1.2.3 (.)",
          "name": "v1.2.3",
          "owner": "my",
          "repo": "repo",
          "tag_name": "v1.2.3",
        },
      ]
    `);
  });
  describe('release flags', () => {
    const tagged = (getTagName, version, tags = {}) => ({
      ...getDefaultParams(),
      version,
      ...tags,
      config: { ...getDefaultParams().config, getTagName },
    });

    it('marks a prerelease and does not make it the latest release', async () => {
      await createGitHubRelease(
        tagged(() => 'v2.0.0-beta.0', '2.0.0-beta.0', {
          tag: 'beta',
          prereleaseTag: 'beta',
        })
      );
      expect(createRelease.mock.calls[0][0]).toMatchObject({
        tag_name: 'v2.0.0-beta.0', // eslint-disable-line camelcase
        prerelease: true,
        make_latest: 'false', // eslint-disable-line camelcase
      });
    });

    it('reads the version of each tag in a monorepo', async () => {
      await createGitHubRelease(
        tagged(() => ['a@5.0.0-beta.1', 'b@3.1.0'], '0.0.0', {
          tag: 'latest',
          prereleaseTag: 'beta',
        })
      );
      expect(createRelease.mock.calls[0][0].prerelease).toBe(true);
      expect(createRelease.mock.calls[1][0]).not.toHaveProperty('prerelease');
      expect(createRelease.mock.calls[1][0]).not.toHaveProperty('make_latest');
    });

    it('does not make a release on another dist-tag the latest', async () => {
      await createGitHubRelease(
        tagged(() => 'v4.80.1', '4.80.1', { tag: 'v4', prereleaseTag: 'v4' })
      );
      expect(createRelease.mock.calls[0][0]).toMatchObject({
        make_latest: 'false', // eslint-disable-line camelcase
      });
      expect(createRelease.mock.calls[0][0]).not.toHaveProperty('prerelease');
    });
  });
});
