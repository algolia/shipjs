import { notifyReleaseSuccess } from '../../util/slack';
import runStep from '../runStep';

export default async ({
  config,
  appName,
  version,
  latestCommitHash,
  latestCommitUrl,
  repoURL,
}) =>
  await runStep({ title: 'Notifying releaseSuccess to Slack' }, async () => {
    await notifyReleaseSuccess({
      config,
      appName,
      version,
      latestCommitHash,
      latestCommitUrl,
      repoURL,
    });
  });
