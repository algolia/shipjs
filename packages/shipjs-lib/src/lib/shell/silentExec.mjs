import exec from './exec.mjs';

export default function silentExec(command, opts = {}) {
  return exec(command, {
    ...opts,
    silent: true,
  });
}
