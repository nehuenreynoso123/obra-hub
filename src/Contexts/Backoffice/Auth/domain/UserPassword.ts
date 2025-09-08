import { UserPasswordLengthExceeded } from './UserPasswordLengthExceeded';
import { NumberValueObject } from '../../../Shared/domain/value-object/IntValueObject';

export class UserPassword extends NumberValueObject {
  constructor(value: number) {
    super(value);
    this.ensureLengthIsLessThan6Characters(value);
  }

  private ensureLengthIsLessThan6Characters(value: number): void {
    if (value.toString().length > 6) {
      throw new UserPasswordLengthExceeded(`The User Password has more than 6 characters`);
    }
  }

  isEquals(other: UserPassword): boolean {
    return this.value === other.value;
  }
}
