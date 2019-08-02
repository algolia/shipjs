import { readFileSync } from 'fs';
import { resolve } from 'path';
import loadConfig from '../config/loadConfig';

export default function getAppName(dir = '.') {
  const { appName, packageJsons } = loadConfig(dir);
  if (appName) {
    return appName;
  }
  const { name } = JSON.parse(readFileSync(resolve(dir, packageJsons[0])));
  return name;
}
