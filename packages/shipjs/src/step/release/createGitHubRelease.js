import path from 'path';
import fs from 'fs';
import globby from 'globby';
import { Octokit } from '@octokit/rest';
import { getRepoInfo } from 'shipjs-lib';
import runStep from '../runStep';
import { getChangelog } from '../../helper';
import { arrayify, print } from '../../util';

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
      const tagNames = arrayify(getTagName({ version }));

      for await (const tagName of tagNames) {
        // extract matching changelog
        const getChangelogFn = extractChangelog || getChangelog;
        const changelog = getChangelogFn({ tagName, version, dir });
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
          data: { id: releaseId },
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
            await octokit.repos.uploadReleaseAsset({
              data: fs.readFileSync(file),
              owner,
              repo,
              release_id: releaseId, // eslint-disable-line camelcase
              name: path.basename(assetPath),
            });
          }
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
