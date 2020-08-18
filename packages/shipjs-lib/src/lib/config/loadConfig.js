import dotenv from 'dotenv';
import { resolve } from 'path';
import { promises, constants } from 'fs';

import defaultConfig from './defaultConfig';
import mergeConfig from './mergeConfig';
dotenv.config();

const exist = path =>
  promises
    .access(path, constants.F_OK)
    .then(() => path)
    .catch(() => false);

export default async function loadConfig(
  dir = '.',
  filename = 'ship.config',
  extensions = ['js', 'cjs', 'mjs']
) {
  const fullPaths = extensions.map(ext => resolve(dir, `${filename}.${ext}`));

  const fullPath = (await Promise.all(fullPaths.map(path => exist(path)))).find(
    path => path
  );

  const userConfig =
    fullPath && (await exist(fullPath)) ? await import(fullPath) : {};

  return mergeConfig(defaultConfig, userConfig);
}
