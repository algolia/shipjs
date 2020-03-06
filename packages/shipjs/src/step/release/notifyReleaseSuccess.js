import { notifyReleaseSuccess } from '../../util';
import runStep from '../runStep';

export default async ({
  config,
  appName,
  version,
  tagName,
  latestCommitHash,
  latestCommitUrl,
  repoURL,
}) =>
  await runStep(
    {
      title: 'Notifying releaseSuccess to Slack',
      skipIf: () =>
        !process.env.SLACK_INCOMING_HOOK ||
        !config.slack ||
        !config.slack.releaseSuccess,
    },
    async () => {
      await notifyReleaseSuccess({
        config,
        appName,
        version,
        tagName,
        latestCommitHash,
        latestCommitUrl,
        repoURL,
      });
    }
  );
