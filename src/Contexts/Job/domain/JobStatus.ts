import { EnumValueObject } from '../../Shared/domain/value-object/EnumValueObject';
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError';

export enum JobStatusEnum {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export class JobStatus extends EnumValueObject<JobStatusEnum> {
  constructor(value: JobStatusEnum) {
    super(value, Object.values(JobStatusEnum));
  }

  protected throwErrorForInvalidValue(value: JobStatusEnum): void {
    throw new InvalidArgumentError(`The JobStatus <${value}> is invalid`);
  }

  static fromValue(value: string): JobStatus {
    for (const status of Object.values(JobStatusEnum)) {
      if (status === value) {
        return new JobStatus(status as JobStatusEnum);
      }
    }

    throw new InvalidArgumentError(`The JobStatus <${value}> is invalid`);
  }

  static open(): JobStatus {
    return new JobStatus(JobStatusEnum.OPEN);
  }

  static assigned(): JobStatus {
    return new JobStatus(JobStatusEnum.ASSIGNED);
  }

  static closed(): JobStatus {
    return new JobStatus(JobStatusEnum.CLOSED);
  }

  static cancelled(): JobStatus {
    return new JobStatus(JobStatusEnum.CANCELLED);
  }

  isOpen(): boolean {
    return this.value === JobStatusEnum.OPEN;
  }

  canReceiveOffer(): boolean {
    return this.value === JobStatusEnum.OPEN;
  }

  toString(): string {
    return this.value;
  }
}
