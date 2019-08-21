import { readFileSync } from 'fs';
import { resolve } from 'path';
import loadConfig from '../config/loadConfig';

export default function getAppName(dir = '.') {
  const { appName, filesToBump } = loadConfig(dir);
  if (appName) {
    return appName;
  }
  const { name } = JSON.parse(readFileSync(resolve(dir, filesToBump[0])));
  return name;
}
