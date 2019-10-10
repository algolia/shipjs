import { exec } from 'shipjs-lib';

export default function wrapExecWithDir(dir) {
  return (command, opts = {}) => {
    exec(command, {
      dir,
      ...opts,
    });
  };
}
