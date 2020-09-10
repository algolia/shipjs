export default function getPublishCommand({
  isYarn,
  publishCommand,
  tag,
  dir,
}) {
  const defaultCommand = `npm publish --tag ${tag}`;

  return publishCommand({ isYarn, tag, defaultCommand, dir });
}
