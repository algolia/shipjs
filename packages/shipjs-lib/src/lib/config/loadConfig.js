import { resolve } from 'path';
import { existsSync } from 'fs';
import defaultConfig from './defaultConfig';

export default function loadConfig(dir = '.', filename = 'ship.config.js') {
  const fullPath = resolve(dir, filename);
  const userConfig = existsSync(fullPath) ? require(fullPath) : {};
  const config = {
    ...defaultConfig,
    ...userConfig,
  };

  config.mergeStrategy = {
    toSameBranch: [],
    toReleaseBranch: {},
    ...config.mergeStrategy,
  };

  return config;
}
