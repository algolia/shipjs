import { resolve } from 'path';
import defaultConfig from './defaultConfig';

export default function loadConfig(dir = '.') {
  const config = require(resolve(dir, 'ship.config.js')) || {};
  return {
    ...defaultConfig,
    ...config,
  };
}
