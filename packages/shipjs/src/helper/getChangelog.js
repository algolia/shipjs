import path from 'path';
import fs from 'fs';
import { extractSpecificChangelog } from './';

export default function getChangelog({ version, dir }) {
  const changelogPath = path.resolve(dir, 'CHANGELOG.md');
  try {
    const changelog = fs.readFileSync(changelogPath, 'utf-8').toString();
    return extractSpecificChangelog({ changelog, version });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}
