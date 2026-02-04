import parseGitHubURL from '../parseGitHubURL.js';

describe('parseGitHubURL', () => {
  it('parses HTTPS URL with .git suffix', () => {
    const result = parseGitHubURL('https://github.com/algolia/shipjs.git');
    expect(result).toEqual({
      owner: 'algolia',
      name: 'shipjs',
      repo: 'algolia/shipjs',
      branch: null,
    });
  });

  it('parses HTTPS URL without .git suffix', () => {
    const result = parseGitHubURL('https://github.com/algolia/shipjs');
    expect(result).toEqual({
      owner: 'algolia',
      name: 'shipjs',
      repo: 'algolia/shipjs',
      branch: null,
    });
  });

  it('parses SSH URL', () => {
    const result = parseGitHubURL('git@github.com:algolia/shipjs.git');
    expect(result).toEqual({
      owner: 'algolia',
      name: 'shipjs',
      repo: 'algolia/shipjs',
      branch: null,
    });
  });

  it('parses git:// protocol URL', () => {
    const result = parseGitHubURL('git://github.com/algolia/shipjs.git');
    expect(result).toEqual({
      owner: 'algolia',
      name: 'shipjs',
      repo: 'algolia/shipjs',
      branch: null,
    });
  });

  it('parses ssh:// protocol URL', () => {
    const result = parseGitHubURL('ssh://git@github.com/algolia/shipjs.git');
    expect(result).toEqual({
      owner: 'algolia',
      name: 'shipjs',
      repo: 'algolia/shipjs',
      branch: null,
    });
  });

  it('parses GitHub Enterprise SSH URL', () => {
    const result = parseGitHubURL(
      'git@github.mycompany.com:algolia/shipjs.git'
    );
    expect(result).toEqual({
      owner: 'algolia',
      name: 'shipjs',
      repo: 'algolia/shipjs',
      branch: null,
    });
  });

  it('parses URL without protocol', () => {
    const result = parseGitHubURL('github.com/algolia/shipjs');
    expect(result).toEqual({
      owner: 'algolia',
      name: 'shipjs',
      repo: 'algolia/shipjs',
      branch: null,
    });
  });

  it('parses URL with branch', () => {
    const result = parseGitHubURL(
      'https://github.com/algolia/shipjs/tree/main'
    );
    expect(result).toEqual({
      owner: 'algolia',
      name: 'shipjs',
      repo: 'algolia/shipjs',
      branch: 'main',
    });
  });

  it('returns nulls for empty URL', () => {
    expect(parseGitHubURL('')).toEqual({
      owner: null,
      name: null,
      repo: null,
      branch: null,
    });
  });

  it('returns nulls for null URL', () => {
    expect(parseGitHubURL(null)).toEqual({
      owner: null,
      name: null,
      repo: null,
      branch: null,
    });
  });

  it('returns nulls for invalid URL', () => {
    expect(parseGitHubURL('not-a-url')).toEqual({
      owner: null,
      name: null,
      repo: null,
      branch: null,
    });
  });
});
