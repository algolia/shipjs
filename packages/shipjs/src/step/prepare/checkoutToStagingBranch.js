import runStep from '../runStep';

export default ({ stagingBranch, dir, dryRun }) =>
  runStep({ title: 'Checking out to the staging branch.' }, ({ run }) => {
    run({ command: `git checkout -b ${stagingBranch}`, dir, dryRun });
  });
