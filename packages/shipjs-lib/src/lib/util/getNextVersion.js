import {
  GIT_COMMIT_PREFIX_PATCH,
  GIT_COMMIT_PREFIX_MINOR,
  GIT_COMMIT_BREAKING_CHANGE,
} from '../const';
import { inc, prerelease } from 'semver';
import silentExec from '../shell/silentExec';

export function getNextVersionFromCommitMessages(version, titles, bodies) {
  if (prerelease(version)) {
    return { version: inc(version, 'prerelease') };
  }
  if (bodies.toUpperCase().includes(GIT_COMMIT_BREAKING_CHANGE)) {
    return { version: inc(version, 'major') };
  }
  let patch = false;
  let minor = false;
  const ignoredMessages = [];
  titles.split('\n').forEach(rawTitle => {
    const title = rawTitle.trim();
    if (!title) {
      return;
    }
    if (title.startsWith('Merge branch')) {
      return;
    }
    const match = title.match(/(.*?)(\(.*?\))?:.*/);
    if (!match || !match[1]) {
      ignoredMessages.push(title);
      return;
    }
    const prefix = match[1].toLowerCase();
    if (GIT_COMMIT_PREFIX_PATCH.has(prefix)) {
      patch = true;
    } else if (GIT_COMMIT_PREFIX_MINOR.has(prefix)) {
      minor = true;
    } else {
      ignoredMessages.push(title);
    }
  });

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

function getTitles(revisionRange, dir) {
  const cmd = `git log ${revisionRange} --pretty=format:%s`;
  return silentExec(cmd, { dir, ignoreError: true })
    .toString()
    .trim();
}

function getBodies(revisionRange, dir) {
  const cmd = `git log ${revisionRange} --pretty=format:%b`;
  return silentExec(cmd, { dir, ignoreError: true })
    .toString()
    .trim();
}

export default function getNextVersion(revisionRange, currentVersion, dir = '.') {
  const titles = getTitles(revisionRange, dir);
  const bodies = getBodies(revisionRange, dir);
  return getNextVersionFromCommitMessages(currentVersion, titles, bodies);
}
