import runStep from '../runStep';
import path from 'path';
import fs from 'fs';
import tempWrite from 'temp-write';

function getChangelog(version) {
  const changelogMatcher = new RegExp(
    `#+?[\\s\\[]*?(${version})(.|\n)+?(?=#+?[\\s\\[]*?\\d\\.\\d|$)`
  );
  const changelogPath = fs.resolve(process.cwd(), 'CHANGELOG.md');
  try {
    const changelogFile = fs.readFileSync(changelogPath, 'utf-8').toString();
    const changelogMatch = changelogFile.match(changelogMatcher);
    if (changelogMatch !== null) {
      return changelogMatch[0];
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
  runStep({ title: 'Creating the GitHub Release' }, ({ run }) => {
    if (config.updateChangelog !== true) return;

    const { getTagName } = config;
    const tagName = getTagName({ version });

    const existingChangelog = getChangelog(version);
    let exportedPath;
    if (existingChangelog !== null) {
      // fetch CHANGELOG
      exportedPath = tempWrite.sync(existingChangelog);
    } else {
      // generate CHANGELOG
      const tmpDir = fs.mkdtempSync('shipjs');
      exportedPath = path.join(tmpDir, 'changelog');

      const conventionalChangelog = path.resolve(
        require.main.filename,
        '../../node_modules/.bin/conventional-changelog'
      );
      const changelogCommand = [
        conventionalChangelog,
        '-p angular',
        '-r 2',
        `-o ${exportedPath}`,
      ].join(' ');

      run(changelogCommand, dir, dryRun);
    }

    // Create GitHub release
    const releaseCommand = [
      'hub',
      'release',
      'create',
      `-F ${exportedPath}`,
      tagName,
    ].join(' ');
    run(releaseCommand, dir, dryRun);
  });
