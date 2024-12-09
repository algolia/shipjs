import runStep from '../runStep.mjs';
import { gitPush } from '../../helper/index.mjs';

export default ({ remote, stagingBranch, dir, dryRun }) =>
  runStep({ title: 'Pushing to remote staging branch.' }, () => {
    gitPush({ remote, refs: [stagingBranch], dir, dryRun });
  });
