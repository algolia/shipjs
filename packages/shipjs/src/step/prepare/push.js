import runStep from '../runStep';
import { gitPush } from '../../helper';

export default ({ config, currentBranch, dir, dryRun }) =>
  runStep({ title: 'Pushing to remote.' }, () => {
    const { remote } = config;
    gitPush({ remote, refs: [currentBranch], dir, dryRun });
  });
