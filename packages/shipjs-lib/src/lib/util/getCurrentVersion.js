import { readFileSync } from 'fs';
import { resolve } from 'path';

export default function getCurrentVersion(dir = '.') {
  const { version } = JSON.parse(readFileSync(resolve(dir, 'package.json')));
  return version;
}
