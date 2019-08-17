import {
  getCurrentVersion,
  getLatestCommitHash,
  getCommitUrl,
  getAppName,
  getRepoURL,
} from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import runStep from '../runStep';

export default ({ dir }) =>
  runStep({ title: 'Gathering repository information.' }, () => {
    const appName = getAppName(dir);
    const version = getCurrentVersion(dir);
    const latestCommitHash = getLatestCommitHash(dir);
    const latestCommitUrl = getCommitUrl(latestCommitHash, dir);
    const repoURL = getRepoURL(dir);

    return {
      appName,
      version,
      latestCommitHash,
      latestCommitUrl,
      repoURL,
    };
  });
