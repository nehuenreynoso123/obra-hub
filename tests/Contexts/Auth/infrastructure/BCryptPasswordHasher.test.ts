import { BCryptPasswordHasher } from '../../../../src/Contexts/Auth/infrastructure/BCryptPasswordHasher';

describe('BCryptPasswordHasher', () => {
  const hasher = new BCryptPasswordHasher();

  describe('hash', () => {
    it('should return a string hash', async () => {
      const hash = await hasher.hash('mypassword');

      expect(typeof hash).toBe('string');
      expect(hash).not.toBe('mypassword');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for the same input', async () => {
      const hash1 = await hasher.hash('mypassword');
      const hash2 = await hasher.hash('mypassword');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true for matching password and hash', async () => {
      const hash = await hasher.hash('mypassword');
      const result = await hasher.compare('mypassword', hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const hash = await hasher.hash('mypassword');
      const result = await hasher.compare('wrongpassword', hash);

      expect(result).toBe(false);
    });
  });
});
