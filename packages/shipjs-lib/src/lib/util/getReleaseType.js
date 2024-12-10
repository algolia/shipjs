import { prerelease, minor, patch } from 'semver';

export default function getReleaseType(nextVersion) {
  if (prerelease(nextVersion) !== null) {
    return 'prerelease';
  }

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
