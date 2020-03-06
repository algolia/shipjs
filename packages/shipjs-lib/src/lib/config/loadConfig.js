import dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

import defaultConfig from './defaultConfig';
import mergeConfig from './mergeConfig';
dotenv.config();

export default function loadConfig(dir = '.', filename = 'ship.config.js') {
  const fullPath = resolve(dir, filename);
  const userConfig = existsSync(fullPath) ? require(fullPath) : {};
  return mergeConfig(defaultConfig, userConfig);
}
