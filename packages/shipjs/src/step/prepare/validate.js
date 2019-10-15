import { getCurrentVersion, getCurrentBranch } from 'shipjs-lib';
import runStep from '../runStep';
import validateBeforePrepare from '../../helper/validateBeforePrepare';

function getBaseBranches({ mergeStrategy }) {
  const { toSameBranch, toReleaseBranch } = mergeStrategy;
  return [...toSameBranch, ...Object.keys(toReleaseBranch)];
}

function printValidationError({
  result,
  currentVersion,
  baseBranches,
  print,
  info,
  error,
}) {
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
    ({ print, info, error, exitProcess }) => {
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
          print,
          info,
          error,
        });
        // exitProcess(1);
      }
      return { currentVersion, baseBranch };
    }
  );
