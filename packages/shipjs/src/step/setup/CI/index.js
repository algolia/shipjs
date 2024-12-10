import askCircleCI from './askCircleCI.js';
import addCircleCIConfig from './addCircleCIConfig.js';

import askGitHubActions from './askGitHubActions.js';
import addGitHubActions from './addGitHubActions.js';

const noop = () => ({});

export default [
  {
    name: 'Circle CI',
    askQuestions: askCircleCI,
    addConfig: addCircleCIConfig,
  },
  {
    name: 'GitHub Actions',
    askQuestions: askGitHubActions,
    addConfig: addGitHubActions,
  },
  {
    name: 'Nothing',
    askQuestions: noop,
    addConfig: noop,
  },
];
