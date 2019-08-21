import {
  getCurrentVersion,
  getLatestCommitHash,
  getCommitUrl,
  getAppName,
  getRepoURL,
  getReleaseTag,
} from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import runStep from '../runStep';

export default ({ dir }) =>
  runStep({ title: 'Gathering repository information.' }, () => {
    const appName = getAppName(dir);
    const version = getCurrentVersion(dir);
    const latestCommitHash = getLatestCommitHash(dir);
    const latestCommitUrl = getCommitUrl(latestCommitHash, dir);
    const repoURL = getRepoURL(dir);
    const releaseTag = getReleaseTag(version);

    return {
      appName,
      version,
      latestCommitHash,
      latestCommitUrl,
      repoURL,
      releaseTag,
    };
  });
