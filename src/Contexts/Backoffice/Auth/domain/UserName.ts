import { StringValueObject } from '../../../Shared/domain/value-object/StringValueObject';
import { UserDoesNotExist } from './UserDoesNotExist';

export class UserName extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.invalidAuthUsername(value);
  }

  private invalidAuthUsername(value: string): void {
    throw new UserDoesNotExist(`The user <${value}> does not exist`);
  }
}
