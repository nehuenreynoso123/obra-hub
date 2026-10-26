import { AssignmentRepository } from '../../domain/AssignmentRepository';
import { OfferRepository } from '../../../Offer/domain/OfferRepository';
import { OfferId } from '../../../Offer/domain/OfferId';
import { JobRepository } from '../../../Job/domain/JobRepository';
import { JobId } from '../../../Job/domain/JobId';
import { InvalidArgumentError } from '../../../Shared/domain/value-object/InvalidArgumentError';
import { TransactionManager } from '../../../Shared/domain/TransactionManager';
import { Assignment } from '../../domain/Assignment';
import { AssignmentId } from '../../domain/AssignmentId';
import { JobId as AssignmentJobId } from '../../domain/JobId';
import { OfferId as AssignmentOfferId } from '../../domain/OfferId';
import { ProfessionalId as AssignmentProfessionalId } from '../../domain/ProfessionalId';
import { ClientId as AssignmentClientId } from '../../domain/ClientId';
import { AssignmentPrimitives } from '../../domain/Assignment';

export class AcceptOffer {
  constructor(
    private readonly transactionManager: TransactionManager,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly offerRepository: OfferRepository,
    private readonly jobRepository: JobRepository
  ) {}

  async run(assignmentId: string, offerId: string): Promise<AssignmentPrimitives> {
    return this.transactionManager.run(async () => {
      const snapshot = await this.offerRepository.findById(new OfferId(offerId));
      if (!snapshot) {
        throw new InvalidArgumentError(`The Offer <${offerId}> does not exist`);
      }

      // Lock order is fixed: job first, then offer. A consistent order prevents deadlocks between concurrent accepts.
      const job = await this.jobRepository.findByIdForUpdate(new JobId(snapshot.jobId.value));
      if (!job) {
        throw new InvalidArgumentError(`The Job <${snapshot.jobId.value}> does not exist`);
      }

      // The offer is re-read after the job lock because the first read may predate a concurrent withdraw or accept.
      const offer = await this.offerRepository.findByIdForUpdate(new OfferId(offerId));
      if (!offer) {
        throw new InvalidArgumentError(`The Offer <${offerId}> does not exist`);
      }

      if (!offer.isPending()) {
        throw new InvalidArgumentError(`The Offer <${offerId}> is not pending`);
      }

      if (!job.canReceiveOffer()) {
        throw new InvalidArgumentError(`The Job <${job.id.value}> cannot be assigned`);
      }

      if (await this.assignmentRepository.findByOfferId(new OfferId(offerId))) {
        throw new InvalidArgumentError(`The Offer <${offerId}> already has an assignment`);
      }

      offer.accept();
      job.assign();
      const assignment = Assignment.create(
        new AssignmentId(assignmentId),
        new AssignmentJobId(offer.jobId.value),
        new AssignmentOfferId(offerId),
        new AssignmentProfessionalId(offer.professionalId.value),
        new AssignmentClientId(job.clientId.value)
      );

      // The reveal is written last so a partial failure never exposes contact without an accepted offer.
      await this.offerRepository.save(offer);
      await this.jobRepository.save(job);
      await this.assignmentRepository.save(assignment);

      return assignment.toPrimitives();
    });
  }
}
