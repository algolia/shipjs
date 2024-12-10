import { IncomingWebhook } from '@slack/webhook';

async function sendSlackMessage({ config, sendArguments }) {
  const { slack } = config;

  if (!process.env.SLACK_INCOMING_HOOK || !sendArguments) {
    return;
  }
  const webhook = new IncomingWebhook(process.env.SLACK_INCOMING_HOOK);
  await webhook.send({
    ...(slack.default || {}),
    ...sendArguments,
  });
}

// https://api.slack.com/docs/messages/builder
export async function notifyPrepared({
  config,
  appName,
  version,
  pullRequestUrl,
}) {
  const { slack = {} } = config;
  const { prepared } = slack;
  if (!prepared) {
    return;
  }

  const sendArguments =
    typeof prepared === 'function'
      ? prepared({ appName, version, pullRequestUrl })
      : prepared;

  await sendSlackMessage({
    config,
    sendArguments,
  });
}

export async function notifyReleaseSuccess({
  config,
  appName,
  version,
  tagNames,
  latestCommitHash,
  latestCommitUrl,
  repoURL,
}) {
  const { slack = {} } = config;
  const { releaseSuccess } = slack;
  if (!releaseSuccess) {
    return;
  }

  const sendArguments =
    typeof releaseSuccess === 'function'
      ? releaseSuccess({
          appName,
          version,
          tagName: tagNames.join(', '),
          latestCommitHash,
          latestCommitUrl,
          repoURL,
        })
      : releaseSuccess;

  await sendSlackMessage({
    config,
    sendArguments,
  });
}
