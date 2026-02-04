import exec from '../exec.js';

describe('exec', () => {
  describe('silent option', () => {
    it('captures output when silent is true', () => {
      const result = exec('echo hello', { silent: true });
      expect(result.code).toBe(0);
      expect(result.stdout.trim()).toBe('hello');
    });

    it('does not capture output when silent is false (output goes to terminal)', () => {
      const result = exec('echo hello', { silent: false });
      expect(result.code).toBe(0);
      expect(result.stdout).toBe('');
    });
  });

  describe('ignoreError option', () => {
    it('throws on non-zero exit code by default', () => {
      expect(() => exec('exit 1', { silent: true })).toThrow();
    });

    it('does not throw when ignoreError is true', () => {
      const result = exec('exit 1', { silent: true, ignoreError: true });
      expect(result.code).toBe(1);
    });
  });
});
