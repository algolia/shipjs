import { readFileSync } from 'fs';
import { resolve } from 'path';
import loadConfig from '../config/loadConfig';

export default function getCurrentVersion(dir = '.') {
  const { packageJsons } = loadConfig(dir);
  const { version } = JSON.parse(readFileSync(resolve(dir, packageJsons[0])));
  return version;
}
