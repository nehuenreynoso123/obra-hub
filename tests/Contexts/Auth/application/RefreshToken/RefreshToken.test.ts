import { RefreshToken } from '../../../../../src/Contexts/Auth/application/RefreshToken/RefreshToken';
import { TokenGeneratorMock } from '../../__mocks__/TokenGeneratorMock';
import { InvalidCredentials } from '../../../../../src/Contexts/Auth/domain/InvalidCredentials';

let tokenGenerator: TokenGeneratorMock;
let refreshToken: RefreshToken;

beforeEach(() => {
  tokenGenerator = new TokenGeneratorMock();
  refreshToken = new RefreshToken(tokenGenerator);
});

describe('RefreshToken', () => {
  it('should return new tokens for a valid refresh token', async () => {
    const payload = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
    tokenGenerator.returnOnVerify(payload);

    const request = { refreshToken: 'valid-refresh-token' };

    const response = await refreshToken.run(request);

    expect(response).toEqual({
      accessToken: 'access-token-mock',
      refreshToken: 'refresh-token-mock'
    });
    tokenGenerator.assertGenerateAccessTokenWasCalled();
    tokenGenerator.assertGenerateRefreshTokenWasCalled();
  });

  it('should throw InvalidCredentials for an expired refresh token', async () => {
    tokenGenerator.returnOnVerifyError(new Error('jwt expired'));

    const request = { refreshToken: 'expired-refresh-token' };

    await expect(refreshToken.run(request)).rejects.toThrow(InvalidCredentials);
  });

  it('should throw InvalidCredentials for an invalid refresh token', async () => {
    tokenGenerator.returnOnVerifyError(new Error('invalid token'));

    const request = { refreshToken: 'invalid-refresh-token' };

    await expect(refreshToken.run(request)).rejects.toThrow(InvalidCredentials);
  });
});
