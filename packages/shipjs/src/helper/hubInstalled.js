import { silentExec } from 'shipjs-lib';

export default function hubInstalled() {
  return silentExec('hub --version', { ignoreError: true }).code === 0;
}
