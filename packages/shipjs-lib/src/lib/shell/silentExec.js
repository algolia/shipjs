import exec from './exec.js';

export default function silentExec(command, opts = {}) {
  return exec(command, {
    ...opts,
    silent: true,
  });
}
