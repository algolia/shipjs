import { getCurrentBranch } from 'shipjs-lib';
import runStep from '../runStep';
import { gitPush } from '../../helper';

export default ({ tagName, config, dir, dryRun }) =>
  runStep({ title: 'Pushing to the remote.' }, () => {
    const currentBranch = getCurrentBranch(dir);
    const { remote, forcePushBranches } = config;
    gitPush({
      remote,
      refs: [currentBranch, tagName],
      forcePushBranches,
      dir,
      dryRun,
    });
  });
