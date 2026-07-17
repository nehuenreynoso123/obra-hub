import jwt from 'jsonwebtoken';
import { TokenGenerator } from '../domain/TokenGenerator';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export class JwtTokenGenerator implements TokenGenerator {
  constructor(
    private readonly accessTokenSecret: string,
    private readonly refreshTokenSecret: string
  ) {}

  async generateAccessToken(payload: object): Promise<string> {
    return jwt.sign(payload, this.accessTokenSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }

  async generateRefreshToken(payload: object): Promise<string> {
    return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: REFRESH_TOKEN_EXPIRY });
  }

  async verify(token: string): Promise<object> {
    return jwt.verify(token, this.refreshTokenSecret) as object;
  }
}
