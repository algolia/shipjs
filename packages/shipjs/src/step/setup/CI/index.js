import askCircleCI from './askCircleCI';
import addCircleCIConfig from './addCircleCIConfig';

import askGitHubActions from './askGitHubActions';
import addGitHubActions from './addGitHubActions';

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
