import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject';

export class Category extends StringValueObject {
  constructor(value: string) {
    super(value.trim().toLowerCase());
  }
}
