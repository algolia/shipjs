import exec from './exec';

export default function silentExec(command, opts = {}) {
  return exec(command, {
    ...opts,
    silent: true,
  });
}
