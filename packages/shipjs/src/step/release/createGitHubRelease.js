import path from 'path';
import fs from 'fs';
import globby from 'globby';
import { Octokit } from '@octokit/rest';
import mime from 'mime-types';
import { getRepoInfo } from 'shipjs-lib';
import runStep from '../runStep';
import { getChangelog } from '../../helper';
import { print } from '../../util';

export default async ({ version, config, dir, dryRun }) =>
  await runStep(
    {
      title: 'Creating a release on GitHub repository',
    },
    async () => {
      const {
        remote,
        getTagName,
        releases: { assetsToUpload, extractChangelog } = {},
      } = config;
      const tagName = getTagName({ version });

      // extract matching changelog
      const getChangelogFn = extractChangelog || getChangelog;
      const changelog = getChangelogFn({ version, dir });
      const content = changelog || '';

      // handle assets
      const assetPaths = await getAssetPaths({
        assetsToUpload,
        dir,
        version,
        tagName,
      });

      if (dryRun) {
        print('Creating a release with the following:');
        print(`  - content: ${content}`);
        if (assetPaths.length > 0) {
          print(`  - assets: ${assetPaths.join(' ')}`);
        }
        return;
      }

      const { owner, name: repo } = getRepoInfo(remote, dir);

      const octokit = new Octokit({
        auth: `token ${process.env.GITHUB_TOKEN}`,
      });

      const {
        data: { upload_url }, // eslint-disable-line camelcase
      } = await octokit.repos.createRelease({
        owner,
        repo,
        tag_name: tagName, // eslint-disable-line camelcase
        name: tagName,
        body: content,
      });

      if (assetPaths.length > 0) {
        for (const assetPath of assetPaths) {
          const file = path.resolve(dir, assetPath);
          octokit.repos.uploadReleaseAsset({
            file: fs.readFileSync(file),
            headers: {
              'content-length': fs.statSync(file).size,
              'content-type': mime.lookup(file),
            },
            name: path.basename(file),
            url: upload_url, // eslint-disable-line camelcase
          });
        }
      }
    }
  );

async function getAssetPaths({ assetsToUpload, dir, version, tagName }) {
  if (!assetsToUpload) {
    return [];
  }
  const assetPaths = [];
  if (typeof assetsToUpload === 'function') {
    // function
    //   assetsToUpload: ({dir, version, tagName}) => [...]
    const files = await Promise.resolve(
      assetsToUpload({ dir, version, tagName })
    );
    assetPaths.push(...files);
  } else if (Array.isArray(assetsToUpload) && assetsToUpload.length > 0) {
    // list
    //   assetsToUpload: ['package.json', 'dist/*.zip']
    for (const asset of assetsToUpload) {
      const files = await globby(asset, { cwd: dir });
      if (files) {
        assetPaths.push(...files);
      }
    }
  } else if (typeof assetsToUpload === 'string') {
    // string
    //   assetsToUpload: 'archive.zip'
    const files = await globby(assetsToUpload, { cwd: dir });
    if (files) {
      assetPaths.push(...files);
    }
  }
  return assetPaths;
}
