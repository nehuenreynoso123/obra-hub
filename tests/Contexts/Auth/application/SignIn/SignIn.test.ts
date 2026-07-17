import { SignIn } from '../../../../../src/Contexts/Auth/application/SignIn/SignIn';
import { AuthUserRepositoryMock } from '../../__mocks__/AuthUserRepositoryMock';
import { PasswordHasherMock } from '../../__mocks__/PasswordHasherMock';
import { TokenGeneratorMock } from '../../__mocks__/TokenGeneratorMock';
import { AuthUser } from '../../../../../src/Contexts/Auth/domain/AuthUser';
import { InvalidCredentials } from '../../../../../src/Contexts/Auth/domain/InvalidCredentials';

let repository: AuthUserRepositoryMock;
let passwordHasher: PasswordHasherMock;
let tokenGenerator: TokenGeneratorMock;
let signIn: SignIn;

beforeEach(() => {
  repository = new AuthUserRepositoryMock();
  passwordHasher = new PasswordHasherMock();
  tokenGenerator = new TokenGeneratorMock();
  signIn = new SignIn(repository, passwordHasher, tokenGenerator);
});

describe('SignIn', () => {
  it('should return tokens for valid credentials', async () => {
    const user = AuthUser.fromPrimitives({
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
      password: '$2b$10$hashedpassword',
      name: 'Test User'
    });
    repository.returnOnFindByEmail(user);
    tokenGenerator.returnOnVerify({ id: user.id.value, email: user.email.value });

    const request = { email: 'test@example.com', password: 'mypassword' };

    const response = await signIn.run(request);

    expect(response).toEqual({
      accessToken: 'access-token-mock',
      refreshToken: 'refresh-token-mock'
    });
    tokenGenerator.assertGenerateAccessTokenWasCalled();
    tokenGenerator.assertGenerateRefreshTokenWasCalled();
  });

  it('should throw InvalidCredentials for unknown email', async () => {
    const request = { email: 'unknown@example.com', password: 'mypassword' };

    await expect(signIn.run(request)).rejects.toThrow(InvalidCredentials);
  });

  it('should throw InvalidCredentials for wrong password', async () => {
    const user = AuthUser.fromPrimitives({
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
      password: '$2b$10$hashedpassword',
      name: 'Test User'
    });
    repository.returnOnFindByEmail(user);
    passwordHasher.returnOnCompare(false);

    const request = { email: 'test@example.com', password: 'wrongpassword' };

    await expect(signIn.run(request)).rejects.toThrow(InvalidCredentials);
  });
});
