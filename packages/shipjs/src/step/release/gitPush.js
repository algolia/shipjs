import { getCurrentBranch } from 'shipjs-lib';
import runStep from '../runStep.js';
import { gitPush } from '../../helper/index.js';

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
