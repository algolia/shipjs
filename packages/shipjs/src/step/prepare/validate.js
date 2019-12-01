import { getCurrentVersion, getCurrentBranch } from 'shipjs-lib';
import runStep from '../runStep';
import { getBaseBranches, validateBeforePrepare } from '../../helper';
import { print, exitProcess } from '../../util';
import { info, error } from '../../color';

function printValidationError({ result, baseBranches }) {
  const messageMap = {
    workingTreeNotClean: 'The working tree is not clean.',
    currentBranchIncorrect: `The current branch must be one of ${JSON.stringify(
      baseBranches
    )}`,
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
      const { mergeStrategy, monorepo } = config;
      const baseBranches = getBaseBranches({ mergeStrategy });
      const currentVersion =
        monorepo && monorepo.mainVersionFile
          ? getCurrentVersion(dir, monorepo.mainVersionFile)
          : getCurrentVersion(dir);
      const result = validateBeforePrepare({
        dir,
        baseBranches,
      });
      const baseBranch = getCurrentBranch(dir);
      if (result !== true) {
        printValidationError({
          result,
          baseBranches,
        });
        exitProcess(1);
      }
      return { currentVersion, baseBranch };
    }
  );
