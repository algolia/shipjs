import hasTag from '../git/hasTag';
import getCurrentVersion from './getCurrentVersion';

export default function hasTagForCurrentVersion(dir = '.') {
  const tag = `v${getCurrentVersion(dir)}`;
  return hasTag(tag, dir);
}
