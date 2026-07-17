import { AuthUser } from '../../domain/AuthUser';
import { AuthUserId } from '../../domain/AuthUserId';
import { AuthUserEmail } from '../../domain/AuthUserEmail';
import { AuthUserPassword } from '../../domain/AuthUserPassword';
import { AuthUserName } from '../../domain/AuthUserName';
import { AuthUserRepository } from '../../domain/AuthUserRepository';
import { PasswordHasher } from '../../domain/PasswordHasher';
import { UserAlreadyExists } from '../../domain/UserAlreadyExists';
import { SignUpRequest } from './SignUpRequest';

export class SignUp {
  constructor(
    private authUserRepository: AuthUserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async run(request: SignUpRequest): Promise<void> {
    const email = new AuthUserEmail(request.email);
    const existingUser = await this.authUserRepository.findByEmail(email);

    if (existingUser) {
      throw new UserAlreadyExists(`The user with email <${request.email}> already exists`);
    }

    const hashedPassword = await this.passwordHasher.hash(request.password);

    const user = new AuthUser(
      new AuthUserId(request.id),
      email,
      AuthUserPassword.fromHashed(hashedPassword),
      new AuthUserName(request.name)
    );

    await this.authUserRepository.save(user);
  }
}
