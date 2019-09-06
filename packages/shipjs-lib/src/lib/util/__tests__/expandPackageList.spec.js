import silentExec from '../../shell/silentExec';
import expandPackageList from '../expandPackageList';

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
});
