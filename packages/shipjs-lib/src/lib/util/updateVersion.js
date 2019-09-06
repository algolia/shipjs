import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export default function updateVersion(nextVersion, dir = '.') {
  const filePath = resolve(dir, 'package.json');
  const json = JSON.parse(readFileSync(filePath).toString());
  json.version = nextVersion;
  writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
}
