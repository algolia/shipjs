export default function parseGitHubURL(url) {
  if (!url) {
    return { owner: null, name: null, repo: null, branch: null };
  }

  let normalized = url.trim();

  const sshMatch = normalized.match(/^git@([^:]+):(.+)$/);
  if (sshMatch) {
    const [, host, path] = sshMatch;
    normalized = `https://${host}/${path}`;
  }

  if (normalized.startsWith('ssh://')) {
    normalized = normalized
      .replace('ssh://', 'https://')
      .replace(/git@([^/]+)/, '$1');
  }

  if (normalized.startsWith('git://')) {
    normalized = normalized.replace('git://', 'https://');
  }

  normalized = normalized.replace(/\.git$/, '');

  if (!normalized.startsWith('http')) {
    normalized = `https://${normalized}`;
  }

  try {
    const parsed = new URL(normalized);
    const pathParts = parsed.pathname.split('/').filter(Boolean);

    if (pathParts.length >= 2) {
      const owner = pathParts[0];
      const name = pathParts[1];
      const repo = `${owner}/${name}`;
      const branch = pathParts[2] === 'tree' ? pathParts[3] || null : null;

      return { owner, name, repo, branch };
    }
  } catch {
    // Invalid URL
  }

  return { owner: null, name: null, repo: null, branch: null };
}
