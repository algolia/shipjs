import { promises } from 'fs';
import { resolve } from 'path';
import loadConfig from '../config/loadConfig';

export default async function getAppName(dir = '.') {
  const { appName } = await loadConfig(dir);
  if (appName) {
    return appName;
  }
  const { name } = JSON.parse(
    await promises.readFile(resolve(dir, 'package.json'))
  );
  return name;
}
