import fs from 'fs';
import path from 'path';
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
  runStep({ title: 'Creating a release on GitHub repository' }, ({ run }) => {
    if (config.updateChangelog !== true) return;

    const { getTagName } = config;
    const tagName = getTagName({ version });

    // extract matching changelog
    const changelog = getChangelog(version, dir);
    const exportedPath = tempWrite.sync(changelog || tagName);

    // create GitHub release
    const releaseCommand = [
      'hub',
      'release',
      'create',
      `-F ${exportedPath}`,
      tagName,
    ].join(' ');

    run(releaseCommand, dir, dryRun);
  });
