export class AuthConfigFactory {
  static createAccessTokenSecret(): string {
    return process.env.JWT_ACCESS_SECRET || 'change-me-in-production';
  }

  static createRefreshTokenSecret(): string {
    return process.env.JWT_REFRESH_SECRET || 'change-me-in-production';
  }
}
