import runStep from './runStep';

export default ({ dir, dryRun }) =>
  runStep({ title: 'Updating from remote.' }, ({ run }) => {
    run({ command: 'git pull', dir, dryRun });
  });
