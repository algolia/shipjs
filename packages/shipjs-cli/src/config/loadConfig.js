import { resolve } from 'path';
import { existsSync } from 'fs';
import defaultConfig from './defaultConfig';

export default function loadConfig(dir = '.', filename = 'ship.config.js') {
  const fullPath = resolve(dir, filename);
  const config = existsSync(fullPath) ? require(fullPath) : {};
  return {
    ...defaultConfig,
    ...config,
  };
}
