import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject';

export class Zone extends StringValueObject {
  constructor(value: string) {
    super(value.trim().toLowerCase());
  }
}
