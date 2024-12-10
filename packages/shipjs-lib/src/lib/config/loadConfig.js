import { resolve } from 'path';
import { promises as fs, constants } from 'fs';

import defaultConfig from './defaultConfig.js';
import mergeConfig from './mergeConfig.js';

const exist = (path) =>
  fs
    .access(path, constants.F_OK)
    .then(() => path)
    .catch(() => false);

const pickDefault = (obj) =>
  typeof obj.default === 'object' ? obj.default : obj;

export default async function loadConfig(
  dir = '.',
  filename = 'ship.config',
  extensions = ['js', 'cjs', 'mjs']
) {
  const fullPaths = extensions.map((ext) => resolve(dir, `${filename}.${ext}`));

  const fullPath = (
    await Promise.all(fullPaths.map((path) => exist(path)))
  ).find((path) => path);

  const userConfig =
    fullPath && (await exist(fullPath))
      ? await import(fullPath).then(pickDefault)
      : {};

  return mergeConfig(defaultConfig, userConfig);
}
