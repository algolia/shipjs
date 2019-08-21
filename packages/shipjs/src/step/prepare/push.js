import runStep from '../runStep';

export default ({ config, currentBranch, dir, dryRun }) =>
  runStep({ title: 'Pushing to remote.' }, ({ run }) => {
    const { remote } = config;
    run(`git push ${remote} ${currentBranch}`, dir, dryRun);
  });
