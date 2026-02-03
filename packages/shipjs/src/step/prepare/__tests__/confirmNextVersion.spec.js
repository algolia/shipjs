import inquirer from 'inquirer';

import confirmNextVersion from '../confirmNextVersion.js';

jest.mock('inquirer');

describe('confirmNextVersion', () => {
  it('works in dry mode', async () => {
    const nextVersion = await confirmNextVersion({
      nextVersion: '1.2.3',
      dryRun: true,
    });
    expect(nextVersion).toBe('1.2.3');
  });

  it('works when yes=true', async () => {
    const nextVersion = await confirmNextVersion({
      nextVersion: '1.2.3',
      yes: true,
    });
    expect(nextVersion).toBe('1.2.3');
  });

  it('works', async () => {
    inquirer.prompt.mockImplementation(() =>
      Promise.resolve({ correct: true })
    );
    const nextVersion = await confirmNextVersion({
      nextVersion: '1.2.3',
    });
    expect(nextVersion).toBe('1.2.3');
  });

  it('works when user types', async () => {
    inquirer.prompt
      .mockImplementationOnce(() => Promise.resolve({ correct: false }))
      .mockImplementationOnce(() =>
        Promise.resolve({ userTypedVersion: '1.2.4' })
      );
    const nextVersion = await confirmNextVersion({
      nextVersion: '1.2.3',
    });
    expect(nextVersion).toBe('1.2.4');
  });
});
