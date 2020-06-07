import {
  getCurrentVersion,
  getLatestCommitMessage,
  getCurrentBranch,
} from 'shipjs-lib';
import runStep from '../runStep';
import { print, exitProcess } from '../../util';
import { info, warning } from '../../color';

export default ({ config, dir }) =>
  runStep({ title: 'Checking the current status.' }, () => {
    const { formatPullRequestTitle, shouldRelease, monorepo } = config;
    const commitMessage = getLatestCommitMessage(dir);
    const currentVersion =
      monorepo && monorepo.mainVersionFile
        ? getCurrentVersion(dir, monorepo.mainVersionFile)
        : getCurrentVersion(dir);
    const currentBranch = getCurrentBranch(dir);
    const validationResult = shouldRelease({
      commitMessage,
      currentVersion,
      currentBranch,
      formatPullRequestTitle,
    });
    if (validationResult !== true) {
      print(warning('Skipping a release due to the following reason:'));
      print(info(`  > ${validationResult}`));
      exitProcess(0);
    }
    return {
      currentVersion,
    };
  });
