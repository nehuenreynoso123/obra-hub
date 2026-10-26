import { AggregateRoot } from '../../Shared/domain/AggregateRoot';
import { AssignmentId } from './AssignmentId';
import { JobId } from './JobId';
import { OfferId } from './OfferId';
import { ProfessionalId } from './ProfessionalId';
import { ClientId } from './ClientId';
import { AssignmentStatus } from './AssignmentStatus';
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError';

export type AssignmentPrimitives = {
  id: string;
  jobId: string;
  offerId: string;
  professionalId: string;
  clientId: string;
  status: string;
};

export class Assignment extends AggregateRoot {
  readonly id: AssignmentId;
  readonly jobId: JobId;
  readonly offerId: OfferId;
  readonly professionalId: ProfessionalId;
  readonly clientId: ClientId;
  status: AssignmentStatus;

  constructor(
    id: AssignmentId,
    jobId: JobId,
    offerId: OfferId,
    professionalId: ProfessionalId,
    clientId: ClientId,
    status: AssignmentStatus = AssignmentStatus.active()
  ) {
    super();
    this.id = id;
    this.jobId = jobId;
    this.offerId = offerId;
    this.professionalId = professionalId;
    this.clientId = clientId;
    this.status = status;
  }

  static create(id: AssignmentId, jobId: JobId, offerId: OfferId, professionalId: ProfessionalId, clientId: ClientId): Assignment {
    return new Assignment(id, jobId, offerId, professionalId, clientId, AssignmentStatus.active());
  }

  complete(): void {
    if (!this.status.isActive()) {
      throw new InvalidArgumentError('Only active assignments can be completed');
    }

    this.status = AssignmentStatus.completed();
  }

  cancel(): void {
    if (!this.status.isActive()) {
      throw new InvalidArgumentError('Only active assignments can be cancelled');
    }

    this.status = AssignmentStatus.cancelled();
  }

  isActive(): boolean {
    return this.status.isActive();
  }

  isCompleted(): boolean {
    return this.status.isCompleted();
  }

  static fromPrimitives(plainData: AssignmentPrimitives): Assignment {
    return new Assignment(
      new AssignmentId(plainData.id),
      new JobId(plainData.jobId),
      new OfferId(plainData.offerId),
      new ProfessionalId(plainData.professionalId),
      new ClientId(plainData.clientId),
      AssignmentStatus.fromValue(plainData.status)
    );
  }

  toPrimitives(): AssignmentPrimitives {
    return {
      id: this.id.value,
      jobId: this.jobId.value,
      offerId: this.offerId.value,
      professionalId: this.professionalId.value,
      clientId: this.clientId.value,
      status: this.status.value
    };
  }
}
