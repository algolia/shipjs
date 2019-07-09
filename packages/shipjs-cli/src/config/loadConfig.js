import path from 'path';
import fs from 'fs';
import defaultConfig from './defaultConfig';

export default function loadConfig(dir = '.', filename = 'ship.config.js') {
  const fullPath = path.resolve(dir, filename);
  const config = fs.existsSync(fullPath) ? require(fullPath) : {};
  return {
    ...defaultConfig,
    ...config,
  };
}
