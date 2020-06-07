import merge from 'deepmerge';

export default function mergeConfig(config1, config2) {
  const config = {
    ...config1,
    ...config2,
  };
  config.slack = merge(config1.slack || {}, config2.slack || {});
  return config;
}
