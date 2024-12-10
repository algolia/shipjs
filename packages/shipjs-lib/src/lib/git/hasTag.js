import silentExec from '../shell/silentExec.js';

export default function hasTag(tag, dir = '.') {
  return silentExec(`git tag -l ${tag}`, { dir }).toString().trim() === tag;
}
