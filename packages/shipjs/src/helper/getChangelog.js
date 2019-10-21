import path from 'path';
import fs from 'fs';

export default function getChangelog(version, rootDir) {
  const changelogMatcher = new RegExp(
    `#+?[\\s\\[]*?(${version})(.|\n)+?(?=#+?[\\s\\[]*?\\d\\.\\d|$)`
  );
  const changelogPath = path.resolve(rootDir, 'CHANGELOG.md');
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
