import dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

import defaultConfig from './defaultConfig';
import mergeConfig from './mergeConfig';
dotenv.config();

export default function loadConfig(dir = '.', filename = 'ship.config.js') {
  const fullPath = resolve(dir, filename);
  const userConfig = existsSync(fullPath) ? require(fullPath) : {};
  const config = mergeConfig(defaultConfig, userConfig);
  config.slackIncomingHook =
    process.env.SLACK_INCOMING_HOOK || config.slackIncomingHook;
  return config;
}
