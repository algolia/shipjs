import path from 'path';

export default function getPackageDirName(packageDir, dir) {
  const fullDir = path.resolve(dir);
  if (packageDir.startsWith(fullDir)) {
    return packageDir.slice(fullDir.length + 1);
  } else {
    return packageDir;
  }
}
