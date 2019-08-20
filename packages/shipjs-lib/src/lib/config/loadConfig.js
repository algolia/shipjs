import dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import defaultConfig from './defaultConfig';
dotenv.config();

export function loadWithUserConfig(userConfig) {
  const config = {
    ...defaultConfig,
    ...userConfig,
  };
  config.mergeStrategy = {
    toSameBranch: [],
    toReleaseBranch: {},
    ...config.mergeStrategy,
  };
  config.slackIncomingHook =
    process.env.SLACK_INCOMING_HOOK || config.slackIncomingHook;
  return config;
}

export default function loadConfig(dir = '.', filename = 'ship.config.js') {
  const fullPath = resolve(dir, filename);
  const userConfig = existsSync(fullPath) ? require(fullPath) : {};
  return loadWithUserConfig(userConfig);
}
