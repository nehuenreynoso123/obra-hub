import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject';
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError';

export class Phone extends StringValueObject {
  constructor(value: string) {
    super(Phone.ensureIsValid(value));
  }

  private static ensureIsValid(value: string): string {
    if (!value) {
      throw new InvalidArgumentError('Phone must be defined');
    }

    const normalized = value.replace(/\s|-/g, '');

    if (!/^\+?[0-9]{8,15}$/.test(normalized)) {
      throw new InvalidArgumentError(`Phone <${value}> is invalid`);
    }

    return normalized;
  }
}
