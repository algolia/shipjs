import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export default function updateVersion({
  nextVersion,
  dir = '.',
  fileName = 'package.json',
}) {
  const filePath = resolve(dir, fileName);
  const json = JSON.parse(readFileSync(filePath).toString());
  json.version = nextVersion;
  writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
}
