import { vi, beforeEach, afterEach } from 'vitest';

import {
  info,
  warning,
  error,
  slateblue,
  bold,
  underline,
  reset,
} from './src/color.js';
import { mockColor } from './tests/util/index.js';

vi.mock('shipjs-lib');
vi.mock('./src/color');
vi.mock('./src/helper');
vi.mock('./src/util', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...Object.fromEntries(Object.keys(actual).map((key) => [key, vi.fn()])),
    arrayify: actual.arrayify,
  };
});

beforeEach(() => {
  [info, warning, error, slateblue, bold, underline, reset].forEach(mockColor);
});

afterEach(() => {
  vi.resetAllMocks();
});
