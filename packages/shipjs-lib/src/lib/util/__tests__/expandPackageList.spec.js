import silentExec from '../../shell/silentExec.js';
import expandPackageList from '../expandPackageList.js';

describe('expandPackageList', () => {
  it('expands package list', () => {
    silentExec('./tests/bootstrap-examples/simple-monorepo.sh');
    expect(expandPackageList(['.'], 'sandbox/simple-monorepo')).toEqual([
      `${process.cwd()}/sandbox/simple-monorepo`,
    ]);

    expect(
      expandPackageList(['.', 'packages/*'], 'sandbox/simple-monorepo')
    ).toEqual([
      `${process.cwd()}/sandbox/simple-monorepo`,
      `${process.cwd()}/sandbox/simple-monorepo/packages/package_a`,
      `${process.cwd()}/sandbox/simple-monorepo/packages/package_b`,
    ]);
  });

  it('expands package list with @(x|y) expression', () => {
    silentExec('./tests/bootstrap-examples/simple-monorepo.sh');

    expect(
      expandPackageList(
        ['.', 'packages/@(package_a|package_b)'],
        'sandbox/simple-monorepo'
      )
    ).toEqual([
      `${process.cwd()}/sandbox/simple-monorepo`,
      `${process.cwd()}/sandbox/simple-monorepo/packages/package_a`,
      `${process.cwd()}/sandbox/simple-monorepo/packages/package_b`,
    ]);

    expect(
      expandPackageList(
        ['.', 'packages/@(package_a|not-existing)'],
        'sandbox/simple-monorepo'
      )
    ).toEqual([
      `${process.cwd()}/sandbox/simple-monorepo`,
      `${process.cwd()}/sandbox/simple-monorepo/packages/package_a`,
    ]);
  });

  it('gets only directories with package.json', () => {
    silentExec('./tests/bootstrap-examples/monorepo-with-nonpkg-directory.sh');
    const projectName = 'monorepo-with-nonpkg-directory';
    expect(
      expandPackageList(['.', 'packages/*'], `sandbox/${projectName}`)
    ).toEqual([
      `${process.cwd()}/sandbox/${projectName}`,
      `${process.cwd()}/sandbox/${projectName}/packages/package_a`,
      `${process.cwd()}/sandbox/${projectName}/packages/package_b`,
    ]);
  });

  it('ignores packages with "!" prefix in package directory', () => {
    silentExec('./tests/bootstrap-examples/simple-monorepo.sh');

    expect(
      expandPackageList(
        ['.', 'packages/*', '!packages/package_a'],
        'sandbox/simple-monorepo'
      )
    ).toEqual([
      `${process.cwd()}/sandbox/simple-monorepo`,
      `${process.cwd()}/sandbox/simple-monorepo/packages/package_b`,
    ]);

    expect(
      expandPackageList(
        ['.', 'packages/*', '!packages/package_a', '!packages/package_b'],
        'sandbox/simple-monorepo'
      )
    ).toEqual([`${process.cwd()}/sandbox/simple-monorepo`]);
  });
});
