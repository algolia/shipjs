import runStep from '../runStep.js';
import { gitPush } from '../../helper/index.js';

export default ({ remote, stagingBranch, dir, dryRun }) =>
  runStep({ title: 'Pushing to remote staging branch.' }, () => {
    gitPush({ remote, refs: [stagingBranch], dir, dryRun });
  });
