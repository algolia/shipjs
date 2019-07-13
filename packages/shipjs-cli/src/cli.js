import prepare from './flow/prepare';
import release from './flow/release';

const flowMap = {
  prepare,
  release,
};

export function cli(args) {
  const flowName = args[2];
  const dir = args[3] || '.';
  const flow = flowMap[flowName];
  flow(dir);
}
