import { exec } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved

export default function wrapExecWithDir(dir) {
  return (command, opts = {}) => {
    exec(command, {
      dir,
      ...opts,
    });
  };
}
