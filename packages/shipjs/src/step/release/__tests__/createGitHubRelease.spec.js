import tempWrite from 'temp-write';
import globby from 'globby';
import createGitHubRelease from '../createGitHubRelease';
import { run } from '../../../util';
jest.mock('temp-write');
jest.mock('globby');

const getDefaultParams = ({ assetsToUpload } = {}) => ({
  version: '1.2.3',
  config: {
    getTagName: () => 'v1.2.3',
    releases: { assetsToUpload },
    updateChangelog: false,
  },
  dir: '.',
  dryRun: false,
});

describe('createGitHubRelease', () => {
  it('works without assets', async () => {
    tempWrite.sync.mockImplementation(() => `/my chan"ge"log/temp/path`);
    await createGitHubRelease(getDefaultParams());
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "command": "hub release create -F '/my chan\\"ge\\"log/temp/path' v1.2.3",
          "dir": ".",
          "dryRun": false,
        },
      ]
    `);
  });

  it('works with assets (fn)', async () => {
    tempWrite.sync.mockImplementation(() => `/temp/path`);
    await createGitHubRelease(
      getDefaultParams({
        assetsToUpload: () => {
          return Promise.resolve(['/path1', '/path2']);
        },
      })
    );
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "command": "hub release create -F /temp/path -a /path1 -a /path2 v1.2.3",
          "dir": ".",
          "dryRun": false,
        },
      ]
    `);
  });

  it('works with assets (list)', async () => {
    tempWrite.sync.mockImplementation(() => `/temp/path`);
    globby.mockImplementation(path => Promise.resolve([path]));
    await createGitHubRelease(
      getDefaultParams({
        assetsToUpload: ['/path1', '/path2'],
      })
    );
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "command": "hub release create -F /temp/path -a /path1 -a /path2 v1.2.3",
          "dir": ".",
          "dryRun": false,
        },
      ]
    `);
  });

  it('works with assets (string)', async () => {
    tempWrite.sync.mockImplementation(() => `/temp/path`);
    globby.mockImplementation(path => Promise.resolve([path]));
    await createGitHubRelease(
      getDefaultParams({
        assetsToUpload: '/path1',
      })
    );
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "command": "hub release create -F /temp/path -a /path1 v1.2.3",
          "dir": ".",
          "dryRun": false,
        },
      ]
    `);
  });
});
