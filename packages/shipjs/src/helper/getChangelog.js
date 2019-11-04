import path from 'path';
import fs from 'fs';
import { extractSpecificChangelog } from './';

export default function getChangelog(version, rootDir) {
  const changelogPath = path.resolve(rootDir, 'CHANGELOG.md');
  try {
    const changelogFile = fs.readFileSync(changelogPath, 'utf-8').toString();
    return extractSpecificChangelog(changelogFile, version);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}
