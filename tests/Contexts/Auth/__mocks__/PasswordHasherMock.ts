import { PasswordHasher } from '../../../../src/Contexts/Auth/domain/PasswordHasher';

export class PasswordHasherMock implements PasswordHasher {
  private hashMock: jest.Mock;
  private compareMock: jest.Mock;
  private hashedValue = '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012';

  constructor() {
    this.hashMock = jest.fn();
    this.compareMock = jest.fn().mockResolvedValue(true);
  }

  async hash(password: string): Promise<string> {
    this.hashMock(password);
    return this.hashedValue;
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    return this.compareMock(password, hashed);
  }

  returnOnCompare(match: boolean) {
    this.compareMock.mockResolvedValue(match);
  }

  assertHashWasCalled(): void {
    expect(this.hashMock).toHaveBeenCalled();
  }

  assertCompareWasCalledWith(expectedPassword: string, expectedHashed: string): void {
    expect(this.compareMock).toHaveBeenCalledWith(expectedPassword, expectedHashed);
  }
}
