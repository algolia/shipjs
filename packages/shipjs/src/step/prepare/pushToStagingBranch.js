import runStep from '../runStep';
import { gitPush } from '../../helper';

export default ({ remote, stagingBranch, dir, dryRun }) =>
  runStep({ title: 'Pushing to remote staging branch.' }, () => {
    gitPush({ remote, refs: [stagingBranch], dir, dryRun });
  });
