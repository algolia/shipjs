import {
  GIT_COMMIT_PREFIX_PATCH,
  GIT_COMMIT_PREFIX_MINOR,
  GIT_COMMIT_BREAKING_CHANGE
} from '../const';
import { inc, prerelease } from 'semver';
import getCommitTitles from '../git/getCommitTitles';
import getCommitBodies from '../git/getCommitBodies';
import getCommitNumbersPerType from './getCommitNumbersPerType';

export function getNextVersionFromCommitMessages(version, titles, bodies) {
  if (prerelease(version)) {
    return { version: inc(version, 'prerelease') };
  }
  if (
    bodies
      .toUpperCase()
      .split('\n')
      .some(line => line.startsWith(GIT_COMMIT_BREAKING_CHANGE))
  ) {
    return { version: inc(version, 'major') };
  }
  const { numbers, ignoredMessages } = getCommitNumbersPerType(titles);
  const minor = Array.from(GIT_COMMIT_PREFIX_MINOR).some(
    prefix => numbers[prefix] > 0
  );
  const patch = Array.from(GIT_COMMIT_PREFIX_PATCH).some(
    prefix => numbers[prefix] > 0
  );
  if (minor) {
    return { version: inc(version, 'minor'), ignoredMessages };
  } else if (patch) {
    return { version: inc(version, 'patch'), ignoredMessages };
  } else if (titles.trim().length === 0) {
    return { version: null, ignoredMessages };
  } else {
    return { version: inc(version, 'patch'), ignoredMessages };
  }
}

export default function getNextVersion(
  revisionRange,
  currentVersion,
  dir = '.'
) {
  const titles = getCommitTitles(revisionRange, dir);
  const bodies = getCommitBodies(revisionRange, dir);
  return getNextVersionFromCommitMessages(currentVersion, titles, bodies);
}
