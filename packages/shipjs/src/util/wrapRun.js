export default ({ exec, print, error }) => ({
  command,
  dir,
  dryRun = false,
  printCommand = true,
}) => {
  if (!dir) {
    throw new Error('`dir` is missing');
  }
  if (printCommand) {
    print(`$ ${command}`);
  }
  if (dryRun) {
    return;
  }
  const { code } = exec(command, { dir });
  if (code !== 0) {
    if (printCommand) {
      print(error('The following command failed:'));
      print(`  > ${command}`);
    } else {
      print(error('Command failed'));
    }
    process.exit(1); // eslint-disable-line no-process-exit
  }
};
