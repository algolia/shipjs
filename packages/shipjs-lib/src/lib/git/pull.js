import exec from '../shell/exec';

export default function pull(dir = '.') {
  exec('git pull', { dir });
}
