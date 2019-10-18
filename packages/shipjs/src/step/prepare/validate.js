import { getCurrentVersion, getCurrentBranch } from 'shipjs-lib';
import runStep from '../runStep';
import { getBaseBranches, validateBeforePrepare } from '../../helper';
import { print, exitProcess } from '../../util';
import { info, error } from '../../color';

function printValidationError({ result, currentVersion, baseBranches }) {
  const messageMap = {
    workingTreeNotClean: 'The working tree is not clean.',
    currentBranchIncorrect: `The current branch must be one of ${JSON.stringify(
      baseBranches
    )}`,
    noTagForCurrentVersion: `There is no git tag for the current version (v${currentVersion})`,
  };

  print(error('Failed to prepare a release for the following reason(s).'));
  result.forEach(reason => {
    print(info(`  - ${messageMap[reason]}`));
  });
}

export default ({ config, dir }) =>
  runStep(
    {
      title: 'Checking the current status.',
    },
    () => {
      const { mergeStrategy, monorepo, getTagName } = config;
      const baseBranches = getBaseBranches({ mergeStrategy });
      const currentVersion =
        monorepo && monorepo.readVersionFrom
          ? getCurrentVersion(dir, monorepo.readVersionFrom)
          : getCurrentVersion(dir);
      const currentTagName = getTagName({ version: currentVersion });
      const result = validateBeforePrepare({
        dir,
        currentTagName,
        baseBranches,
      });
      const baseBranch = getCurrentBranch(dir);
      if (result !== true) {
        printValidationError({
          result,
          currentVersion,
          baseBranches,
        });
        exitProcess(1);
      }
      return { currentVersion, baseBranch };
    }
  );
