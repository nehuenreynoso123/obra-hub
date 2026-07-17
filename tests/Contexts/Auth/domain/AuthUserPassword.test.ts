import { AuthUserPassword } from '../../../../src/Contexts/Auth/domain/AuthUserPassword';

describe('AuthUserPassword', () => {
  describe('fromHashed', () => {
    it('should create a password from a hashed string', () => {
      const hashed = '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012';
      const password = AuthUserPassword.fromHashed(hashed);

      expect(password.value).toBe(hashed);
    });
  });

  describe('fromPlainText', () => {
    it('should create a password from a plain text string', () => {
      const password = AuthUserPassword.fromPlainText('mysecretpassword');

      expect(password.value).toBe('mysecretpassword');
    });
  });

  describe('value', () => {
    it('should store the value correctly', () => {
      const password = AuthUserPassword.fromPlainText('test123');

      expect(password.value).toBe('test123');
    });
  });
});
