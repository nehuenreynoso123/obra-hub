import { AggregateRoot } from '../../../Shared/domain/AggregateRoot';
import { UserId } from './UserId';
import { UserName } from './UserName';
import { UserEmail } from './UserEmail';
import { UserZone } from './UserZone';
import { UserPassword } from './UserPassword';

export class User extends AggregateRoot {
  readonly id: UserId;
  readonly name: UserName;
  readonly email: UserEmail;
  readonly zone: UserZone;
  readonly password: UserPassword;

  constructor(id: UserId, name: UserName, email: UserEmail, zone: UserZone, password: UserPassword) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
    this.zone = zone;
    this.password = password;
  }

  static fromPrimitives(plainData: { id: string; name: string; email: string; zone: string; password: string }): User {
    return new User(
      new UserId(plainData.id),
      new UserName(plainData.name),
      new UserEmail(plainData.email),
      new UserZone(plainData.zone),
      new UserPassword(plainData.password)
    );
  }

  toPrimitives(): any {
    return {
      id: this.id.value,
      name: this.name.value,
      email: this.email.value,
      zone: this.zone.value,
      password: this.password.value
    };
  }
}

//antes
/* export class Account {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly zone: string;
  readonly password: string;

  constructor(id: string, name: string, email: string, zone: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.zone = zone;
    this.password = password;
  }
}
 */
