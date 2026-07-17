import { AuthUserRepository } from '../../domain/AuthUserRepository';
import { AuthUserEmail } from '../../domain/AuthUserEmail';
import { PasswordHasher } from '../../domain/PasswordHasher';
import { TokenGenerator } from '../../domain/TokenGenerator';
import { InvalidCredentials } from '../../domain/InvalidCredentials';
import { SignInRequest } from './SignInRequest';
import { SignInResponse } from './SignInResponse';

export class SignIn {
  constructor(
    private authUserRepository: AuthUserRepository,
    private passwordHasher: PasswordHasher,
    private tokenGenerator: TokenGenerator
  ) {}

  async run(request: SignInRequest): Promise<SignInResponse> {
    const email = new AuthUserEmail(request.email);
    const user = await this.authUserRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentials(`Invalid credentials for email <${request.email}>`);
    }

    const passwordMatch = await this.passwordHasher.compare(request.password, user.password.value);

    if (!passwordMatch) {
      throw new InvalidCredentials(`Invalid credentials for email <${request.email}>`);
    }

    const payload = { id: user.id.value, email: user.email.value };
    const accessToken = await this.tokenGenerator.generateAccessToken(payload);
    const refreshToken = await this.tokenGenerator.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
