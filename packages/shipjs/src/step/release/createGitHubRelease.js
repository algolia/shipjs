import fs from 'fs';
import path from 'path';

import { Octokit } from '@octokit/rest';
import { globby } from 'globby';
import { prerelease as getPrerelease } from 'semver';
import { getRepoInfo } from 'shipjs-lib';

import { getChangelog } from '../../helper/index.js';
import { arrayify, print } from '../../util/index.js';
import runStep from '../runStep.js';

export default async ({
  version,
  tag,
  prereleaseTag = tag,
  config,
  dir,
  dryRun,
}) =>
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

        const releaseFlags = getReleaseFlags({
          tagName,
          version,
          tag,
          prereleaseTag,
        });

        if (dryRun) {
          print('Creating a release with the following:');
          print(`  - content: ${content}`);
          Object.entries(releaseFlags).forEach(([key, value]) =>
            print(`  - ${key}: ${value}`)
          );
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
          ...releaseFlags,
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

// `pkg@1.0.0-beta.0` or `v1.0.0-beta.0` -> `1.0.0-beta.0`
const VERSION_AT_END = /(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/;

// A prerelease is marked as such on GitHub, and neither it nor a version
// published under a dist-tag other than `latest` (e.g. a fix on an older major)
// becomes the repository's "Latest" release.
function getReleaseFlags({ tagName, version, tag, prereleaseTag }) {
  const match = VERSION_AT_END.exec(tagName);
  const tagVersion = match ? match[1] : version;
  const isPrerelease = Boolean(getPrerelease(tagVersion));
  const distTag = isPrerelease ? prereleaseTag : tag;
  const flags = {};
  if (isPrerelease) {
    flags.prerelease = true;
  }
  if (isPrerelease || (distTag !== undefined && distTag !== 'latest')) {
    flags.make_latest = 'false'; // eslint-disable-line camelcase
  }
  return flags;
}

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
