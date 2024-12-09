import askCircleCI from './askCircleCI.mjs';
import addCircleCIConfig from './addCircleCIConfig.mjs';

import askGitHubActions from './askGitHubActions.mjs';
import addGitHubActions from './addGitHubActions.mjs';

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
