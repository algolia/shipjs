import runStep from '../runStep.mjs';
import { gitPush } from '../../helper/index.mjs';

export default ({ remote, currentBranch, forcePushBranches, dir, dryRun }) =>
  runStep({ title: 'Pushing to remote.' }, () => {
    gitPush({
      remote,
      refs: [currentBranch],
      forcePushBranches,
      dir,
      dryRun,
    });
  });
