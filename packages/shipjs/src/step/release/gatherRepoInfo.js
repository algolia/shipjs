import {
  getLatestCommitHash,
  getCommitUrl,
  getAppName,
  getRepoInfo,
  getReleaseTag,
} from 'shipjs-lib';
import runStep from '../runStep';

export default async ({ remote, version, dir }) =>
  await runStep({ title: 'Gathering repository information.' }, async () => {
    const appName = await getAppName(dir);
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
