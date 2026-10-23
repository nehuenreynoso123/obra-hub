import { NumberValueObject } from '../../Shared/domain/value-object/IntValueObject';
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError';

export class Rating extends NumberValueObject {
  constructor(value: number) {
    super(value);
    this.ensureIsValid(value);
  }

  private ensureIsValid(value: number): void {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new InvalidArgumentError(`Rating <${value}> must be between 1 and 5`);
    }
  }
}
