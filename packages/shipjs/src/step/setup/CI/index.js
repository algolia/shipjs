import askCircleCI from './askCircleCI';
import addCircleCIConfig from './addCircleCIConfig';

const noop = () => ({});

export default [
  {
    name: 'Circle CI',
    askQustions: askCircleCI,
    addConfig: addCircleCIConfig,
  },
  {
    name: 'Nothing',
    askQustions: noop,
    addConfig: noop,
  },
];
