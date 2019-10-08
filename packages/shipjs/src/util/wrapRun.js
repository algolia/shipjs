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
  const result = exec(command, { dir });
  if (result.code !== 0) {
    print(error('The following command failed:'));
    print(`  > ${command}`);
    process.exit(1); // eslint-disable-line no-process-exit
  }
  // eslint-disable-next-line consistent-return
  return result.stdout;
};
