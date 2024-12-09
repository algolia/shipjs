import { getCurrentBranch } from 'shipjs-lib';
import runStep from '../runStep.mjs';
import { gitPush } from '../../helper/index.mjs';

export default ({ tagNames, config, dir, dryRun }) =>
  runStep({ title: 'Pushing to the remote.' }, () => {
    const currentBranch = getCurrentBranch(dir);
    const { remote, forcePushBranches } = config;
    gitPush({
      remote,
      refs: [currentBranch, ...tagNames],
      forcePushBranches,
      dir,
      dryRun,
    });
  });
