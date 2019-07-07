import { exec as execOrg, pwd, cd } from 'shelljs';

export default function exec(command, opts = {}) {
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
