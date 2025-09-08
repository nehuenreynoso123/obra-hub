import { UserRepository } from '../../domain/UserRepository';
export class UserAuthenticator {
  constructor(private userRepository: UserRepository) {}

  public authenticate(AuthUserName: string, AuthPassword: string): void {}

  private ensureUserExist(): void {}
  private ensureCredentialsAreValid(): void {}


}
