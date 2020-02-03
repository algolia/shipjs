import { GIT_COMMIT_PREFIX_PATCH, GIT_COMMIT_PREFIX_MINOR } from '../const';

export default function getCommitNumbersPerType(commitTitles) {
  const ignoredMessages = [];
  const numbers = {};
  commitTitles.split('\n').forEach(rawTitle => {
    const title = rawTitle.trim();
    if (!title) {
      return;
    }
    if (title.startsWith('Merge branch')) {
      return;
    }
    const match = title.match(/(.*?)(\(.*?\))?:.*/);
    if (!match || !match[1]) {
      ignoredMessages.push(title);
      return;
    }
    const prefix = match[1].toLowerCase();
    if (
      GIT_COMMIT_PREFIX_PATCH.has(prefix) ||
      GIT_COMMIT_PREFIX_MINOR.has(prefix)
    ) {
      numbers[prefix] = numbers[prefix] || 0;
      numbers[prefix] += 1;
    } else {
      ignoredMessages.push(title);
    }
  });
  return { numbers, ignoredMessages };
}
