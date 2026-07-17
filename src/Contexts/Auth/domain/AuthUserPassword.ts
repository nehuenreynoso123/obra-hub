import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject';

export class AuthUserPassword extends StringValueObject {
  static fromHashed(hashed: string): AuthUserPassword {
    return new AuthUserPassword(hashed);
  }

  static fromPlainText(plain: string): AuthUserPassword {
    return new AuthUserPassword(plain);
  }
}
