import runStep from './runStep';

export default ({ dir, dryRun }) =>
  runStep({ title: 'Pushing to remote.' }, ({ run }) => {
    run('git pull', dir, dryRun);
  });
