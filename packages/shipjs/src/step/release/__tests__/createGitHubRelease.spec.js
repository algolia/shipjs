import fs from 'fs';

import { Octokit } from '@octokit/rest';
import globby from 'globby';
import { getRepoInfo } from 'shipjs-lib';

import createGitHubRelease from '../createGitHubRelease.js';

jest.mock('temp-write');
jest.mock('@octokit/rest');
jest.mock('globby');
jest.mock('shipjs-lib');
jest.mock('fs');

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

const createRelease = jest.fn();
const uploadReleaseAsset = jest.fn();

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
    jest.spyOn(fs, 'readFileSync').mockImplementation();
    jest.spyOn(fs, 'statSync').mockImplementation(() => ({ size: 1024 }));
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
    const mockExtractChangelog = jest
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
});
