const merge = require('deepmerge');

export default function mergeConfig(config1, config2) {
  const config = {
    ...config1,
    ...config2,
  };
  config.mergeStrategy = {
    toSameBranch: [],
    toReleaseBranch: {},
    ...config.mergeStrategy,
  };
  config.slack = merge(config1.slack || {}, config2.slack || {});
  return config;
}
