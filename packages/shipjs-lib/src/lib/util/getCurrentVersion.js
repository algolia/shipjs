import { readFileSync } from 'fs';
import { resolve } from 'path';
import loadConfig from '../config/loadConfig';

export default function getCurrentVersion(dir = '.') {
  const { filesToBump } = loadConfig(dir);
  const { version } = JSON.parse(readFileSync(resolve(dir, filesToBump[0])));
  return version;
}
