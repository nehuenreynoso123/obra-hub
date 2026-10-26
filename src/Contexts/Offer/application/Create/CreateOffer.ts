import { OfferRepository } from '../../domain/OfferRepository';
import { JobRepository } from '../../../Job/domain/JobRepository';
import { Offer } from '../../domain/Offer';
import { OfferId } from '../../domain/OfferId';
import { JobId } from '../../domain/JobId';
import { ProfessionalId } from '../../domain/ProfessionalId';
import { InvalidArgumentError } from '../../../Shared/domain/value-object/InvalidArgumentError';

export class CreateOffer {
  constructor(private readonly offerRepository: OfferRepository, private readonly jobRepository: JobRepository) {}

  async run(id: string, jobId: string, professionalId: string, message: string, priceEstimate: string | null = null): Promise<void> {
    const job = await this.jobRepository.findById(new JobId(jobId));
    if (!job) {
      throw new InvalidArgumentError(`The Job <${jobId}> does not exist`);
    }

    if (!job.canReceiveOffer()) {
      throw new InvalidArgumentError(`The Job <${jobId}> cannot receive offers`);
    }

    const existing = await this.offerRepository.findPendingByJobAndProfessional(new JobId(jobId), new ProfessionalId(professionalId));
    if (existing) {
      throw new InvalidArgumentError('A pending offer already exists for this job and professional');
    }

    const offer = Offer.create(new OfferId(id), new JobId(jobId), new ProfessionalId(professionalId), message, priceEstimate);

    await this.offerRepository.save(offer);
  }
}
