export default function getPublishCommand({
  isYarn,
  publishCommand,
  tag,
  dir,
}) {
  const defaultCommand = isYarn
    ? `yarn publish --no-git-tag-version --non-interactive --tag ${tag}`
    : `npm publish --tag ${tag}`;

  return publishCommand({ isYarn, tag, defaultCommand, dir });
}
