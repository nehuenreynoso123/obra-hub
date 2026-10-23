import { AggregateRoot } from '../../Shared/domain/AggregateRoot';
import { OfferId } from './OfferId';
import { JobId } from './JobId';
import { ProfessionalId } from './ProfessionalId';
import { OfferStatus } from './OfferStatus';
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError';

export type OfferPrimitives = {
  id: string;
  jobId: string;
  professionalId: string;
  message: string;
  priceEstimate?: string | null;
  status: string;
};

export class Offer extends AggregateRoot {
  readonly id: OfferId;
  readonly jobId: JobId;
  readonly professionalId: ProfessionalId;
  message: string;
  priceEstimate: string | null;
  status: OfferStatus;

  constructor(
    id: OfferId,
    jobId: JobId,
    professionalId: ProfessionalId,
    message: string,
    priceEstimate: string | null = null,
    status: OfferStatus = OfferStatus.pending()
  ) {
    super();
    this.id = id;
    this.jobId = jobId;
    this.professionalId = professionalId;
    this.message = message;
    this.priceEstimate = priceEstimate;
    this.status = status;
  }

  static create(id: OfferId, jobId: JobId, professionalId: ProfessionalId, message: string, priceEstimate: string | null = null): Offer {
    return new Offer(id, jobId, professionalId, message, priceEstimate, OfferStatus.pending());
  }

  accept(): void {
    if (!this.status.isPending()) {
      throw new InvalidArgumentError('Only pending offers can be accepted');
    }
    this.status = OfferStatus.accepted();
  }

  reject(): void {
    if (!this.status.isPending()) {
      throw new InvalidArgumentError('Only pending offers can be rejected');
    }
    this.status = OfferStatus.rejected();
  }

  withdraw(): void {
    if (!this.status.isPending()) {
      throw new InvalidArgumentError('Only pending offers can be withdrawn');
    }
    this.status = OfferStatus.withdrawn();
  }

  isPending(): boolean {
    return this.status.isPending();
  }

  static fromPrimitives(plainData: OfferPrimitives): Offer {
    return new Offer(
      new OfferId(plainData.id),
      new JobId(plainData.jobId),
      new ProfessionalId(plainData.professionalId),
      plainData.message,
      plainData.priceEstimate ?? null,
      OfferStatus.fromValue(plainData.status)
    );
  }

  toPrimitives(): OfferPrimitives {
    return {
      id: this.id.value,
      jobId: this.jobId.value,
      professionalId: this.professionalId.value,
      message: this.message,
      priceEstimate: this.priceEstimate,
      status: this.status.value
    };
  }
}
