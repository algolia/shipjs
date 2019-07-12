import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PACKAGE_JSON } from '../const';

export default function getCurrentVersion(dir = '.') {
  const { version } = JSON.parse(readFileSync(resolve(dir, PACKAGE_JSON)));
  return version;
}
