import runStep from '../runStep';
import { gitPush } from '../../helper';

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
