export interface TokenGenerator {
  generateAccessToken(payload: object): Promise<string>;
  generateRefreshToken(payload: object): Promise<string>;
  verify(token: string): Promise<object>;
}
