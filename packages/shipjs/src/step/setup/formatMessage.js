import { grey, reset } from '../../color.js';

const formatMessage = (message, description = '') =>
  [
    message,
    ...description
      .trim()
      .split('\n')
      .map((line) => `  ${reset(grey(line.trim()))}`),
  ].join('\n');

export default formatMessage;
