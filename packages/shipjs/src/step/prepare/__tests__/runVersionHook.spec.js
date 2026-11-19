import { vi } from 'vitest';

import { exitProcess, wrapExecWithDir } from '../../../util/index.js';
import runVersionHook from '../runVersionHook.js';

describe('runVersionHook', () => {
  beforeEach(() => {
    wrapExecWithDir.mockImplementation(() => vi.fn());
  });

  it('passes prerelease and graduate to the hook', async () => {
    const version = vi.fn().mockResolvedValue({ nextVersion: '5.0.0' });
    await runVersionHook({
      version,
      dir: '.',
      prerelease: null,
      graduate: true,
    });
    expect(version).toHaveBeenCalledWith(
      expect.objectContaining({ dir: '.', prerelease: null, graduate: true })
    );
  });

  it('returns nextVersion without packages', async () => {
    const result = await runVersionHook({
      version: () => ({ nextVersion: '1.2.3' }),
      dir: '.',
    });
    expect(result).toEqual({ nextVersion: '1.2.3', packages: null });
  });

  it('returns packages and defaults nextVersion to the first one', async () => {
    const packages = [
      { name: 'a', version: '5.0.0-beta.0' },
      { name: 'b', version: '2.1.0-beta.0' },
    ];
    const result = await runVersionHook({
      version: () => ({ packages }),
      dir: '.',
    });
    expect(result).toEqual({ nextVersion: '5.0.0-beta.0', packages });
  });

  it('keeps an explicit nextVersion next to packages', async () => {
    const packages = [{ name: 'a', version: '5.0.0' }];
    const result = await runVersionHook({
      version: () => ({ nextVersion: '9.9.9', packages }),
      dir: '.',
    });
    expect(result).toEqual({ nextVersion: '9.9.9', packages });
  });

  it('exits with nothing to release', async () => {
    await runVersionHook({ version: () => ({ packages: [] }), dir: '.' });
    expect(exitProcess).toHaveBeenCalledWith(0);
  });

  it('exits with nothing to release when the hook returns nothing', async () => {
    await runVersionHook({ version: () => undefined, dir: '.' });
    expect(exitProcess).toHaveBeenCalledWith(0);
  });

  it('refuses packages that are not an array', async () => {
    await runVersionHook({
      version: () => ({ nextVersion: '1.0.0', packages: 'a' }),
      dir: '.',
    });
    expect(exitProcess).toHaveBeenCalledWith(1);
  });
});
