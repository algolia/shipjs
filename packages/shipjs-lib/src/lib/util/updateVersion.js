import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export default function updateVersion(filesToBump, nextVersion, dir = '.') {
  filesToBump.forEach(file => {
    const filePath = resolve(dir, file);
    const json = JSON.parse(readFileSync(filePath).toString());
    json.version = nextVersion;
    writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
  });
}
