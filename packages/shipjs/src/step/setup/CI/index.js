import addCircleCIConfig from './addCircleCIConfig.js';
import addGitHubActions from './addGitHubActions.js';
import askCircleCI from './askCircleCI.js';
import askGitHubActions from './askGitHubActions.js';

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
