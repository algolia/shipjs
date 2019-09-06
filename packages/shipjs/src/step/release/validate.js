import {
  getCurrentVersion,
  getCurrentBranch,
  getLatestCommitMessage,
} from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import runStep from '../runStep';

export default ({ config, dir }) =>
  runStep(
    { title: 'Checking the current status.' },
    ({ print, info, warning, exitProcess }) => {
      const { mergeStrategy, shouldRelease, monorepo } = config;
      const commitMessage = getLatestCommitMessage(dir);
      const currentVersion =
        monorepo && monorepo.readVersionFrom
          ? getCurrentVersion(dir, monorepo.readVersionFrom)
          : getCurrentVersion(dir);
      const currentBranch = getCurrentBranch(dir);
      const validationResult = shouldRelease({
        commitMessage,
        currentVersion,
        currentBranch,
        mergeStrategy,
      });
      if (validationResult !== true) {
        print(warning('Skipping a release due to the following reason:'));
        print(info(`  > ${validationResult}`));
        exitProcess(0);
      }
      return {
        currentVersion,
      };
    }
  );
