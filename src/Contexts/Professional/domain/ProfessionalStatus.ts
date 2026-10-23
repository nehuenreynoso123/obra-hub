import { EnumValueObject } from '../../Shared/domain/value-object/EnumValueObject';
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError';

export enum ProfessionalStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export class ProfessionalStatus extends EnumValueObject<ProfessionalStatusEnum> {
  constructor(value: ProfessionalStatusEnum) {
    super(value, Object.values(ProfessionalStatusEnum));
  }

  protected throwErrorForInvalidValue(value: ProfessionalStatusEnum): void {
    throw new InvalidArgumentError(`The ProfessionalStatus <${value}> is invalid`);
  }

  static fromValue(value: string): ProfessionalStatus {
    for (const status of Object.values(ProfessionalStatusEnum)) {
      if (status === value) {
        return new ProfessionalStatus(status);
      }
    }

    throw new InvalidArgumentError(`The ProfessionalStatus <${value}> is invalid`);
  }

  static pending(): ProfessionalStatus {
    return new ProfessionalStatus(ProfessionalStatusEnum.PENDING);
  }

  static active(): ProfessionalStatus {
    return new ProfessionalStatus(ProfessionalStatusEnum.ACTIVE);
  }

  static suspended(): ProfessionalStatus {
    return new ProfessionalStatus(ProfessionalStatusEnum.SUSPENDED);
  }

  isActive(): boolean {
    return this.value === ProfessionalStatusEnum.ACTIVE;
  }

  public toString(): string {
    return this.value;
  }
}
