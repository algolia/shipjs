import { promises as fs } from 'fs';
import { resolve } from 'path';
import loadConfig from '../config/loadConfig.mjs';

export default async function getAppName(dir = '.') {
  const { appName } = await loadConfig(dir);
  if (appName) {
    return appName;
  }
  const { name } = JSON.parse(await fs.readFile(resolve(dir, 'package.json')));
  return name;
}
