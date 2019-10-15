import fs from 'fs';
import path from 'path';
import globby from 'globby';
import tempWrite from 'temp-write';

import runStep from '../runStep';

function getChangelog(version, rootDir) {
  const changelogMatcher = new RegExp(
    `#+?[\\s\\[]*?(${version})(.|\n)+?(?=#+?[\\s\\[]*?\\d\\.\\d|$)`
  );
  const changelogPath = path.resolve(rootDir, 'CHANGELOG.md');
  try {
    const changelogFile = fs.readFileSync(changelogPath, 'utf-8').toString();
    const changelogMatch = changelogFile.match(changelogMatcher);
    if (changelogMatch !== null) {
      // because first line of a log file must be title of the release
      return `${version}\n\n${changelogMatch[0]}`;
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
  return null;
}

export default ({ version, config, dir, dryRun }) =>
  runStep(
    { title: 'Creating a release on GitHub repository' },
    async ({ run }) => {
      const { getTagName, release } = config;
      const tagName = getTagName({ version });
      const args = [];

      // extract matching changelog
      const changelog = config.updateChangelog
        ? getChangelog(version, dir)
        : null;
      const exportedPath = tempWrite.sync(changelog || tagName);
      args.push(`-F ${exportedPath}`);

      // handle assets
      if (release && release.assetsToUpload) {
        const option = release.assetsToUpload;
        const assetPaths = [];

        if (Array.isArray(option) && option.length > 0) {
          // list
          for (const asset of option) {
            const files = await globby(asset);
            assetPaths.push(...files);
          }
        } else if (typeof option === 'function') {
          // function
          const files = await Promise.resolve(
            option({ dir, version, tagName })
          );
          assetPaths.push(...files);
        } else if (typeof option === 'string') {
          // string
          assetPaths.push(option);
        }

        for (const asset of assetPaths) {
          args.push('-a', asset);
        }
      }

      // create GitHub release
      const hubCommand = ['hub', 'release', 'create'];
      const command = [...hubCommand, ...args, tagName].join(' ');
      run({ command, dir, dryRun });
    }
  );
