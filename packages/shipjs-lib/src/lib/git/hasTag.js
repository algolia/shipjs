import silentExec from '../shell/silentExec';

export default function hasTag(tag, dir = '.') {
  return silentExec(`git tag -l ${tag}`, { dir }).toString().trim() === tag;
}
