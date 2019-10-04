import { notifyReleaseStart } from '../../util/slack';
import runStep from '../runStep';

export default async ({
  config,
  appName,
  version,
  latestCommitHash,
  latestCommitUrl,
}) =>
  await runStep(
    {
      title: 'Notifying releaseStart to Slack',
      skipIf: () =>
        !config.slackIncomingHook ||
        !config.slack ||
        !config.slack.releaseStart,
    },
    async () => {
      await notifyReleaseStart({
        config,
        appName,
        version,
        latestCommitHash,
        latestCommitUrl,
      });
    }
  );
