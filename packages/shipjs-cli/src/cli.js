import prepare from './flow/prepare';

const flowMap = {
  prepare,
};

export function cli(args) {
  const flowName = args[2];
  const dir = args[3] || '.';
  const flow = flowMap[flowName];
  flow(dir);
}
