import {
  getLatestCommitHash,
  getCommitUrl,
  getAppName,
  getRepoInfo,
  getReleaseTag,
} from 'shipjs-lib';
import runStep from '../runStep';

export default ({ remote, version, dir }) =>
  runStep({ title: 'Gathering repository information.' }, () => {
    const appName = getAppName(dir);
    const latestCommitHash = getLatestCommitHash(dir);
    const latestCommitUrl = getCommitUrl(remote, latestCommitHash, dir);
    const { url: repoURL } = getRepoInfo(remote, dir);
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
