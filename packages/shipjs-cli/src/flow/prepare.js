import {
  getCurrentVersion,
  hasTagForCurrentVersion,
  getNextVersion,
  updateVersion,
  validate,
  exec,
} from 'shipjs-lib';
import loadConfig from '../config/loadConfig';
import { info, warning, error } from '../color';

function printValidationError(result, { currentVersion, baseBranches }) {
  const messageMap = {
    working_tree_not_clean: 'The working tree is not clean.',
    current_branch_incorrect: `The current branch must be one of ${JSON.stringify(
      baseBranches
    )}`,
    no_tag_for_current_version: `There is no git tag for the current version (v${currentVersion})`,
  };

  console.log(
    error('Failed to prepare a release for the following reason(s).')
  );
  result.forEach(reason => {
    console.log(info(`  - ${messageMap[reason]}`));
  });
}

export default (dir = '.') => {
  const { baseBranches } = loadConfig(dir);
  console.log(info('Validating...'));
  const result = validate({
    dir,
    baseBranches,
  });
  const currentVersion = getCurrentVersion(dir);
  if (result !== true) {
    return printValidationError(result, { currentVersion, baseBranches });
  }
  console.log(info('Validation passed!'));
  const run = command => {
    console.log('$', command);
    exec(command, { dir });
  };

  run('git pull');
  const nextVersion = getNextVersion(dir);
  console.log({ currentVersion, nextVersion });
};
