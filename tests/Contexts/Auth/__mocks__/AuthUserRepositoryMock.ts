import { AuthUser } from '../../../../src/Contexts/Auth/domain/AuthUser';
import { AuthUserEmail } from '../../../../src/Contexts/Auth/domain/AuthUserEmail';
import { AuthUserRepository } from '../../../../src/Contexts/Auth/domain/AuthUserRepository';

export class AuthUserRepositoryMock implements AuthUserRepository {
  private saveMock: jest.Mock;
  private findByEmailMock: jest.Mock;
  private users: Array<AuthUser> = [];

  constructor() {
    this.saveMock = jest.fn();
    this.findByEmailMock = jest.fn();
  }

  async save(user: AuthUser): Promise<void> {
    this.saveMock(user);
  }

  async findByEmail(email: AuthUserEmail) {
    this.findByEmailMock(email);
    return this.users.find(u => u.email.value === email.value) || null;
  }

  returnOnFindByEmail(user: AuthUser | null) {
    if (user) {
      this.users.push(user);
    }
  }

  assertSaveHaveBeenCalledWith(expected: AuthUser): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }

  assertFindByEmailWasCalled(): void {
    expect(this.findByEmailMock).toHaveBeenCalled();
  }
}
