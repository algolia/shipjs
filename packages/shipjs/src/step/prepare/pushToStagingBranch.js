import { gitPush } from '../../helper/index.js';
import runStep from '../runStep.js';

export default ({ remote, stagingBranch, dir, dryRun }) =>
  runStep({ title: 'Pushing to remote staging branch.' }, () => {
    gitPush({ remote, refs: [stagingBranch], dir, dryRun });
  });
