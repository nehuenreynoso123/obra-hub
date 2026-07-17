import { SignUp } from '../../../../../src/Contexts/Auth/application/SignUp/SignUp';
import { AuthUserRepositoryMock } from '../../__mocks__/AuthUserRepositoryMock';
import { PasswordHasherMock } from '../../__mocks__/PasswordHasherMock';
import { AuthUser } from '../../../../../src/Contexts/Auth/domain/AuthUser';
import { AuthUserId } from '../../../../../src/Contexts/Auth/domain/AuthUserId';
import { AuthUserEmail } from '../../../../../src/Contexts/Auth/domain/AuthUserEmail';
import { AuthUserPassword } from '../../../../../src/Contexts/Auth/domain/AuthUserPassword';
import { AuthUserName } from '../../../../../src/Contexts/Auth/domain/AuthUserName';
import { UserAlreadyExists } from '../../../../../src/Contexts/Auth/domain/UserAlreadyExists';

let repository: AuthUserRepositoryMock;
let passwordHasher: PasswordHasherMock;
let signUp: SignUp;

beforeEach(() => {
  repository = new AuthUserRepositoryMock();
  passwordHasher = new PasswordHasherMock();
  signUp = new SignUp(repository, passwordHasher);
});

describe('SignUp', () => {
  it('should create a new user successfully', async () => {
    const request = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
      password: 'mypassword',
      name: 'Test User'
    };

    await signUp.run(request);

    repository.assertSaveHaveBeenCalledWith(
      new AuthUser(
        new AuthUserId(request.id),
        new AuthUserEmail(request.email),
        AuthUserPassword.fromHashed('$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012'),
        new AuthUserName(request.name)
      )
    );
    passwordHasher.assertHashWasCalled();
  });

  it('should throw UserAlreadyExists when email is already taken', async () => {
    const existingUser = AuthUser.fromPrimitives({
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'test@example.com',
      password: '$2b$10$hashedpassword',
      name: 'Existing User'
    });
    repository.returnOnFindByEmail(existingUser);

    const request = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
      password: 'mypassword',
      name: 'Test User'
    };

    await expect(signUp.run(request)).rejects.toThrow(UserAlreadyExists);
  });
});
