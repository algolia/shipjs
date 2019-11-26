import { diff } from 'semver';

export default function getReleaseType(currentVersion, nextVersion) {
  return diff(currentVersion, nextVersion);
}
