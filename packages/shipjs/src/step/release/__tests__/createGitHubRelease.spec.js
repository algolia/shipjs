import globby from 'globby';
import fs from 'fs';
import mime from 'mime-types';
import { getRepoInfo } from 'shipjs-lib';
import { Octokit } from '@octokit/rest';
import createGitHubRelease from '../createGitHubRelease';
jest.mock('temp-write');
jest.mock('@octokit/rest');
jest.mock('globby');
jest.mock('shipjs-lib');
jest.mock('fs');
jest.mock('mime-types');

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
        upload_url: 'https://dummy/upload/url', // eslint-disable-line camelcase
      },
    }));

    Octokit.mockImplementation(function () {
      this.repos = { createRelease, uploadReleaseAsset };
    });

    getRepoInfo.mockImplementation(() => ({
      owner: 'my',
      name: 'repo',
    }));
    fs.readFileSync = jest.fn();
    fs.statSync = jest.fn().mockImplementation(() => ({ size: 1024 }));
    mime.lookup.mockImplementation(() => 'application/zip');
    globby.mockImplementation((path) => Promise.resolve([path]));
  });

  it('works without assets', async () => {
    await createGitHubRelease(getDefaultParams());
    expect(createRelease).toHaveBeenCalledTimes(1);
    expect(createRelease.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
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
      Array [
        Object {
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
      Array [
        Array [
          Object {
            "file": undefined,
            "headers": Object {
              "content-length": 1024,
              "content-type": "application/zip",
            },
            "name": "path1",
            "url": "https://dummy/upload/url",
          },
        ],
        Array [
          Object {
            "file": undefined,
            "headers": Object {
              "content-length": 1024,
              "content-type": "application/zip",
            },
            "name": "path2",
            "url": "https://dummy/upload/url",
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
      Array [
        Object {
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
      Array [
        Array [
          Object {
            "file": undefined,
            "headers": Object {
              "content-length": 1024,
              "content-type": "application/zip",
            },
            "name": "path1",
            "url": "https://dummy/upload/url",
          },
        ],
        Array [
          Object {
            "file": undefined,
            "headers": Object {
              "content-length": 1024,
              "content-type": "application/zip",
            },
            "name": "path2",
            "url": "https://dummy/upload/url",
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
      Array [
        Object {
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
      Array [
        Array [
          Object {
            "file": undefined,
            "headers": Object {
              "content-length": 1024,
              "content-type": "application/zip",
            },
            "name": "path1",
            "url": "https://dummy/upload/url",
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
      Array [
        Object {
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
