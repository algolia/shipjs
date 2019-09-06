import { readFileSync } from 'fs';
import { resolve } from 'path';

export default function getCurrentVersion(
  dir = '.',
  filename = 'package.json'
) {
  const { version } = JSON.parse(readFileSync(resolve(dir, filename)));
  return version;
}
