import { AggregateRoot } from '../../Shared/domain/AggregateRoot';
import { AuthUserId } from './AuthUserId';
import { AuthUserEmail } from './AuthUserEmail';
import { AuthUserPassword } from './AuthUserPassword';
import { AuthUserName } from './AuthUserName';

export class AuthUser extends AggregateRoot {
  readonly id: AuthUserId;
  readonly email: AuthUserEmail;
  readonly password: AuthUserPassword;
  readonly name: AuthUserName;

  constructor(id: AuthUserId, email: AuthUserEmail, password: AuthUserPassword, name: AuthUserName) {
    super();
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
  }

  static fromPrimitives(plainData: {
    id: string;
    email: string;
    password: string;
    name: string;
  }): AuthUser {
    return new AuthUser(
      new AuthUserId(plainData.id),
      new AuthUserEmail(plainData.email),
      AuthUserPassword.fromHashed(plainData.password),
      new AuthUserName(plainData.name)
    );
  }

  toPrimitives(): any {
    return {
      id: this.id.value,
      email: this.email.value,
      password: this.password.value,
      name: this.name.value
    };
  }
}
