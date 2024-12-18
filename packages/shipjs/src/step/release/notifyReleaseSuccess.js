import { notifyReleaseSuccess } from '../../util/index.js';
import runStep from '../runStep.js';

export default async ({
  config,
  appName,
  version,
  tagNames,
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
        tagNames,
        latestCommitHash,
        latestCommitUrl,
        repoURL,
      });
    }
  );
