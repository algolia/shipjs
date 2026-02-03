import { inc, prerelease } from 'semver';

import {
  GIT_COMMIT_PREFIX_PATCH,
  GIT_COMMIT_PREFIX_MINOR,
  GIT_COMMIT_BREAKING_CHANGE,
} from '../const.js';
import getCommitBodies from '../git/getCommitBodies.js';
import getCommitTitles from '../git/getCommitTitles.js';

import getCommitNumbersPerType from './getCommitNumbersPerType.js';

export function getNextVersionFromCommitMessages(version, titles, bodies) {
  if (prerelease(version)) {
    return { version: inc(version, 'prerelease') };
  }
  if (
    bodies
      .toUpperCase()
      .split('\n')
      .some((line) => line.startsWith(GIT_COMMIT_BREAKING_CHANGE))
  ) {
    return { version: inc(version, 'major') };
  }
  const { numbers, ignoredMessages } = getCommitNumbersPerType(titles);
  const minor = Array.from(GIT_COMMIT_PREFIX_MINOR).some(
    (prefix) => numbers[prefix] > 0
  );
  const patch = Array.from(GIT_COMMIT_PREFIX_PATCH).some(
    (prefix) => numbers[prefix] > 0
  );
  if (minor) {
    return { version: inc(version, 'minor'), ignoredMessages };
  }
  if (patch) {
    return { version: inc(version, 'patch'), ignoredMessages };
  }
  if (titles.trim().length === 0) {
    return { version: null, ignoredMessages };
  }
  return { version: inc(version, 'patch'), ignoredMessages };
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
