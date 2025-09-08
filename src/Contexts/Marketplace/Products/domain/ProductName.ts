import { StringValueObject } from '../../../Shared/domain/value-object/StringValueObject';
import { ProductNameLengthExceeded } from './ProductNameLengthExceeded';

export class ProductName extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan50Characters(value);
  }

  private ensureLengthIsLessThan50Characters(value: string): void {
    if (value.length > 50) {
      throw new ProductNameLengthExceeded(`The Product Name <${value}> has more than 50 characters`);
    }
  }
}
