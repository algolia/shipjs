import path from 'path';
import getPackageDirName from '../getPackageDirName';

describe('getPackageDirName', () => {
  it('subtracts dirName', () => {
    const dir = path.resolve('.');
    const packageDir = path.resolve('.', 'abc');
    expect(getPackageDirName(packageDir, dir)).toEqual('abc');
  });

  it('returns when it does not match', () => {
    const dir = path.resolve('.');
    const packageDir = path.resolve('..', 'abc');
    expect(getPackageDirName(packageDir, dir)).toEqual(packageDir);
  });
});
