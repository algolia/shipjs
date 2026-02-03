import { gitPush } from '../../helper/index.js';
import runStep from '../runStep.js';

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
