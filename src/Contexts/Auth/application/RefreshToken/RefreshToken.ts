import { TokenGenerator } from '../../domain/TokenGenerator';
import { InvalidCredentials } from '../../domain/InvalidCredentials';
import { RefreshTokenRequest } from './RefreshTokenRequest';
import { RefreshTokenResponse } from './RefreshTokenResponse';

export class RefreshToken {
  constructor(private tokenGenerator: TokenGenerator) {}

  async run(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    let payload: object;

    try {
      payload = await this.tokenGenerator.verify(request.refreshToken);
    } catch {
      throw new InvalidCredentials('Invalid or expired refresh token');
    }

    const accessToken = await this.tokenGenerator.generateAccessToken(payload);
    const refreshToken = await this.tokenGenerator.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
