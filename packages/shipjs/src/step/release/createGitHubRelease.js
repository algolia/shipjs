import fs from 'fs';
import path from 'path';
import globby from 'globby';
import tempWrite from 'temp-write';
import { quote } from 'shell-quote';

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

export default async ({ version, config, dir, dryRun }) =>
  await runStep(
    { title: 'Creating a release on GitHub repository' },
    async ({ run }) => {
      const { getTagName, releases } = config;
      const tagName = getTagName({ version });
      const args = [];

      // extract matching changelog
      const changelog = config.updateChangelog
        ? getChangelog(version, dir)
        : null;
      const exportedPath = tempWrite.sync(changelog || tagName);
      args.push('-F', quote([exportedPath]));

      // handle assets
      if (releases && releases.assetsToUpload) {
        const option = releases.assetsToUpload;
        const assetPaths = [];

        if (typeof option === 'function') {
          // function
          //   assetsToUpload: ({dir, version, tagName}) => [...]
          const files = await Promise.resolve(
            option({ dir, version, tagName })
          );
          assetPaths.push(...files);
        } else if (Array.isArray(option) && option.length > 0) {
          // list
          //   assetsToUpload: ['package.json', 'dist/*.zip']
          for (const asset of option) {
            const files = await globby(asset, { cwd: dir });
            if (files) {
              assetPaths.push(...files);
            }
          }
        } else if (typeof option === 'string') {
          // string
          //   assetsToUpload: 'archive.zip'
          const files = await globby(option, { cwd: dir });
          if (files) {
            assetPaths.push(...files);
          }
        }

        for (const asset of assetPaths) {
          args.push('-a', quote([path.resolve(dir, asset)]));
        }
      }

      // create GitHub release
      const hubCommand = ['hub', 'release', 'create'];
      const command = [...hubCommand, ...args, tagName].join(' ');
      run({ command, dir, dryRun });
    }
  );
