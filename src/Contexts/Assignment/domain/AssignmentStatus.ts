import { EnumValueObject } from '../../Shared/domain/value-object/EnumValueObject';
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError';

export enum AssignmentStatusEnum {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export class AssignmentStatus extends EnumValueObject<AssignmentStatusEnum> {
  constructor(value: AssignmentStatusEnum) {
    super(value, Object.values(AssignmentStatusEnum));
  }

  protected throwErrorForInvalidValue(value: AssignmentStatusEnum): void {
    throw new InvalidArgumentError(`The AssignmentStatus <${value}> is invalid`);
  }

  static fromValue(value: string): AssignmentStatus {
    for (const status of Object.values(AssignmentStatusEnum)) {
      if (status === value) {
        return new AssignmentStatus(status as AssignmentStatusEnum);
      }
    }

    throw new InvalidArgumentError(`The AssignmentStatus <${value}> is invalid`);
  }

  static active(): AssignmentStatus {
    return new AssignmentStatus(AssignmentStatusEnum.ACTIVE);
  }

  static completed(): AssignmentStatus {
    return new AssignmentStatus(AssignmentStatusEnum.COMPLETED);
  }

  static cancelled(): AssignmentStatus {
    return new AssignmentStatus(AssignmentStatusEnum.CANCELLED);
  }

  isCompleted(): boolean {
    return this.value === AssignmentStatusEnum.COMPLETED;
  }

  toString(): string {
    return this.value;
  }
}
