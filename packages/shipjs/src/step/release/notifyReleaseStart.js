import { notifyReleaseStart } from '../../util/slack';
import runStep from '../runStep';

export default async ({
  config,
  appName,
  version,
  latestCommitHash,
  latestCommitUrl,
}) =>
  await runStep({ title: 'Notifying releaseStart to Slack' }, async () => {
    await notifyReleaseStart({
      config,
      appName,
      version,
      latestCommitHash,
      latestCommitUrl,
    });
  });
