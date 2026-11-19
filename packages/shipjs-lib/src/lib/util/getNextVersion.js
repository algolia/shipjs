import { inc, prerelease, gt } from 'semver';

import {
  GIT_COMMIT_PREFIX_PATCH,
  GIT_COMMIT_PREFIX_MINOR,
  GIT_COMMIT_BREAKING_CHANGE,
} from '../const.js';
import getCommitBodies from '../git/getCommitBodies.js';
import getCommitTitles from '../git/getCommitTitles.js';

import getCommitNumbersPerType from './getCommitNumbersPerType.js';

function getBumpType(titles, bodies) {
  if (
    bodies
      .toUpperCase()
      .split('\n')
      .some((line) => GIT_COMMIT_BREAKING_CHANGE.test(line.trim()))
  ) {
    return { type: 'major' };
  }
  if (titles.split('\n').some((line) => /^\w+(\(.*?\))?!:/.test(line.trim()))) {
    return { type: 'major' };
  }
  const { numbers, ignoredMessages } = getCommitNumbersPerType(titles);
  const minor = Array.from(GIT_COMMIT_PREFIX_MINOR).some(
    (prefix) => numbers[prefix] > 0
  );
  const patch = Array.from(GIT_COMMIT_PREFIX_PATCH).some(
    (prefix) => numbers[prefix] > 0
  );
  if (minor) {
    return { type: 'minor', ignoredMessages };
  }
  if (patch) {
    return { type: 'patch', ignoredMessages };
  }
  if (titles.trim().length === 0) {
    return { type: null, ignoredMessages };
  }
  return { type: 'patch', ignoredMessages };
}

// With a `preid`, the next version is always a prerelease on that channel:
// - `1.2.3` + feat commits -> `1.3.0-beta.0` (the bump the commits ask for)
// - `1.3.0-beta.0` -> `1.3.0-beta.1` (same channel)
// - `1.3.0-beta.1` with preid `rc` -> `1.3.0-rc.0` (next channel)
function getNextPrereleaseVersion(version, titles, bodies, preid) {
  const { type, ignoredMessages } = getBumpType(titles, bodies);
  if (type === null) {
    return { version: null, ignoredMessages };
  }
  const [currentPreid] = prerelease(version) || [];
  let nextVersion;
  if (currentPreid === undefined) {
    nextVersion = inc(version, `pre${type}`, preid);
  } else if (currentPreid === preid) {
    nextVersion = inc(version, 'prerelease');
  } else {
    nextVersion = inc(version, 'prerelease', preid);
  }
  if (!gt(nextVersion, version)) {
    throw new Error(
      `Cannot move from \`${version}\` to the \`${preid}\` channel: \`${nextVersion}\` is not greater than \`${version}\`.`
    );
  }
  return { version: nextVersion, ignoredMessages };
}

// `graduate` releases a prerelease as its stable version, whatever the
// commits say: `5.0.0-rc.2` -> `5.0.0`.
function getGraduatedVersion(version) {
  if (!prerelease(version)) {
    throw new Error(`Cannot graduate \`${version}\`: it is not a prerelease.`);
  }
  return { version: inc(version, 'patch') };
}

export function getNextVersionFromCommitMessages(
  version,
  titles,
  bodies,
  { preid, graduate = false } = {}
) {
  if (preid && graduate) {
    throw new Error('`preid` and `graduate` cannot be used together.');
  }
  if (graduate) {
    return getGraduatedVersion(version);
  }
  if (preid) {
    return getNextPrereleaseVersion(version, titles, bodies, preid);
  }
  if (prerelease(version)) {
    return { version: inc(version, 'prerelease') };
  }
  const { type, ignoredMessages } = getBumpType(titles, bodies);
  if (type === 'major') {
    return { version: inc(version, 'major') };
  }
  if (type === null) {
    return { version: null, ignoredMessages };
  }
  return { version: inc(version, type), ignoredMessages };
}

export default function getNextVersion(
  revisionRange,
  currentVersion,
  dir = '.',
  { preid, graduate } = {}
) {
  const titles = getCommitTitles(revisionRange, dir);
  const bodies = getCommitBodies(revisionRange, dir);
  return getNextVersionFromCommitMessages(currentVersion, titles, bodies, {
    preid,
    graduate,
  });
}
