import askCircleCI from './askCircleCI';
import addCircleCIConfig from './addCircleCIConfig';

import askGithubActions from './askGithubActions';
import addGithubActions from './addGithubActions';

const noop = () => ({});

export default [
  {
    name: 'Circle CI',
    askQustions: askCircleCI,
    addConfig: addCircleCIConfig,
  },
  {
    name: 'Github Actions',
    askQustions: askGithubActions,
    addConfig: addGithubActions,
  },
  {
    name: 'Nothing',
    askQustions: noop,
    addConfig: noop,
  },
];
