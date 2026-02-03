export default function parseGitHubURL(url) {
  if (!url) {
    return { owner: null, name: null, repo: null, branch: null };
  }

  let normalized = url.trim();

  if (normalized.startsWith('git@')) {
    normalized = normalized.replace('git@github.com:', 'https://github.com/');
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
    // URL parsing failed
  }

  return { owner: null, name: null, repo: null, branch: null };
}
