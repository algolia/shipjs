import hasTag from './hasTag';
import currentVersion from './currentVersion';

export default function hasTagForCurrentVersion(dir = '.') {
  const tag = `v${currentVersion(dir)}`;
  return hasTag(tag, dir);
}
