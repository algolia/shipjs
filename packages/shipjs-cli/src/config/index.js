import path from 'path';
import defaultConfig from './defaultConfig';

export default function loadConfig(dir = '.') {
  const config = require(path.resolve(dir, 'ship.config.js')) || {};
  return {
    ...defaultConfig,
    ...config,
  };
}
