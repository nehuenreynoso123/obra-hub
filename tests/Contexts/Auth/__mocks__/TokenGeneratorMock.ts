import { TokenGenerator } from '../../../../src/Contexts/Auth/domain/TokenGenerator';

export class TokenGeneratorMock implements TokenGenerator {
  private generateAccessTokenMock: jest.Mock;
  private generateRefreshTokenMock: jest.Mock;
  private verifyMock: jest.Mock;

  constructor() {
    this.generateAccessTokenMock = jest.fn();
    this.generateRefreshTokenMock = jest.fn();
    this.verifyMock = jest.fn();
  }

  async generateAccessToken(payload: object): Promise<string> {
    this.generateAccessTokenMock(payload);
    return 'access-token-mock';
  }

  async generateRefreshToken(payload: object): Promise<string> {
    this.generateRefreshTokenMock(payload);
    return 'refresh-token-mock';
  }

  async verify(token: string): Promise<object> {
    return this.verifyMock(token);
  }

  returnOnVerify(payload: object) {
    this.verifyMock.mockResolvedValue(payload);
  }

  returnOnVerifyError(error: Error) {
    this.verifyMock.mockRejectedValue(error);
  }

  assertGenerateAccessTokenWasCalled(): void {
    expect(this.generateAccessTokenMock).toHaveBeenCalled();
  }

  assertGenerateRefreshTokenWasCalled(): void {
    expect(this.generateRefreshTokenMock).toHaveBeenCalled();
  }
}
