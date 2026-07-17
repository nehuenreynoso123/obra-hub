import { JwtTokenGenerator } from '../../../../src/Contexts/Auth/infrastructure/JwtTokenGenerator';

describe('JwtTokenGenerator', () => {
  const accessTokenSecret = 'test-access-secret';
  const refreshTokenSecret = 'test-refresh-secret';
  const generator = new JwtTokenGenerator(accessTokenSecret, refreshTokenSecret);

  describe('generateAccessToken', () => {
    it('should return a string token', async () => {
      const payload = { id: 'user-1', email: 'test@example.com' };
      const token = await generator.generateAccessToken(payload);

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe('generateRefreshToken', () => {
    it('should return a string token', async () => {
      const payload = { id: 'user-1', email: 'test@example.com' };
      const token = await generator.generateRefreshToken(payload);

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe('verify', () => {
    it('should verify a valid refresh token and return the payload', async () => {
      const payload = { id: 'user-1', email: 'test@example.com' };
      const token = await generator.generateRefreshToken(payload);
      const verified = await generator.verify(token);

      expect(verified).toMatchObject(payload);
    });

    it('should throw for an invalid token', async () => {
      await expect(generator.verify('invalid-token')).rejects.toThrow();
    });

    it('should throw for a token signed with a different secret', async () => {
      const otherGenerator = new JwtTokenGenerator('other-access', 'other-refresh');
      const token = await otherGenerator.generateRefreshToken({ id: 'user-1' });

      await expect(generator.verify(token)).rejects.toThrow();
    });
  });
});
