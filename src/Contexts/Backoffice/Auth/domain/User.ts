import { UserId } from './UserId';
import { AggregateRoot } from '../../../Shared/domain/AggregateRoot';
import { UserName } from './UserName';
import { UserLastName } from './UserLastName';
import { UserPassword } from './UserPassword';

export class User extends AggregateRoot {
  readonly id: UserId;
  readonly name: UserName;
  readonly lastname: UserLastName;
  readonly password: UserPassword;

  constructor(params: { id: UserId; name: UserName; lastname: UserLastName; password: UserPassword }) {
    super();
    this.id = params.id;
    this.name = params.name;
    this.lastname = params.lastname;
    this.password = params.password;
  }

  static fromPrimitives(plainData: { id: string; name: string; lastname: string; password: number }): User {
    return new User({
      id: new UserId(plainData.id),
      name: new UserName(plainData.name),
      lastname: new UserLastName(plainData.lastname),
      password: new UserPassword(plainData.password)
    });
  }

  toPrimitives(): any {
    return {
      id: this.id.value,
      name: this.name.value,
      lastname: this.lastname.value,
      password: this.password.value
    };
  }
}
