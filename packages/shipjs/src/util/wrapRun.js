export default ({ exec, print, error }) => (command, dir, dryRun = false) => {
  if (!dir) {
    throw new Error('`dir` is missing');
  }
  print(`$ ${command}`);
  if (dryRun) {
    return;
  }
  const { code } = exec(command, { dir });
  if (code !== 0) {
    print(error('The following command failed:'));
    print(`  > ${command}`);
    process.exit(1); // eslint-disable-line no-process-exit
  }
};
