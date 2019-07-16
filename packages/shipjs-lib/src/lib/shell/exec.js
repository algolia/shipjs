import shell from 'shelljs';

export default function exec(command, opts = {}) {
  const { exec: execOrg, pwd, cd } = shell;
  const { dir, ...restOpts } = opts;
  let result;
  if (typeof dir === 'undefined') {
    result = execOrg(command, restOpts);
  } else {
    const initialPath = pwd();
    cd(dir);
    result = execOrg(command, restOpts);
    cd(initialPath);
  }
  return result;
}
