import { diff, prerelease, minor, patch } from 'semver';

export default function getReleaseType(currentVersion, nextVersion) {
  if (prerelease(currentVersion) === null && prerelease(nextVersion) !== null) {
    return 'prerelease';
  }
  if (prerelease(currentVersion) !== null && prerelease(nextVersion) === null) {
    if (patch(nextVersion) === 0) {
      if (minor(nextVersion) === 0) {
        return 'major';
      } else {
        return 'minor';
      }
    } else {
      return 'patch';
    }
  }
  return diff(currentVersion, nextVersion);
}
