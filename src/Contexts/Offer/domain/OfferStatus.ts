import { EnumValueObject } from '../../Shared/domain/value-object/EnumValueObject';
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError';

export enum OfferStatusEnum {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  WITHDRAWN = 'WITHDRAWN'
}

export class OfferStatus extends EnumValueObject<OfferStatusEnum> {
  constructor(value: OfferStatusEnum) {
    super(value, Object.values(OfferStatusEnum));
  }

  protected throwErrorForInvalidValue(value: OfferStatusEnum): void {
    throw new InvalidArgumentError(`The OfferStatus <${value}> is invalid`);
  }

  static fromValue(value: string): OfferStatus {
    for (const status of Object.values(OfferStatusEnum)) {
      if (status === value) {
        return new OfferStatus(status as OfferStatusEnum);
      }
    }

    throw new InvalidArgumentError(`The OfferStatus <${value}> is invalid`);
  }

  static pending(): OfferStatus {
    return new OfferStatus(OfferStatusEnum.PENDING);
  }

  static accepted(): OfferStatus {
    return new OfferStatus(OfferStatusEnum.ACCEPTED);
  }

  static rejected(): OfferStatus {
    return new OfferStatus(OfferStatusEnum.REJECTED);
  }

  static withdrawn(): OfferStatus {
    return new OfferStatus(OfferStatusEnum.WITHDRAWN);
  }

  isPending(): boolean {
    return this.value === OfferStatusEnum.PENDING;
  }

  isAccepted(): boolean {
    return this.value === OfferStatusEnum.ACCEPTED;
  }

  toString(): string {
    return this.value;
  }
}
