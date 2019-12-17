import askCircleCI from './askCircleCI';
import addCircleCIConfig from './addCircleCIConfig';

import askGithubActions from './askGithubActions';
import addGithubActions from './addGithubActions';

const noop = () => ({});

export default [
  {
    name: 'Circle CI',
    askQuestions: askCircleCI,
    addConfig: addCircleCIConfig,
  },
  {
    name: 'Github Actions',
    askQuestions: askGithubActions,
    addConfig: addGithubActions,
  },
  {
    name: 'Nothing',
    askQuestions: noop,
    addConfig: noop,
  },
];
