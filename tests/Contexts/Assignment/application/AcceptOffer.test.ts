import { AcceptOffer } from '../../../../src/Contexts/Assignment/application/Accept/AcceptOffer';
import { AssignmentRepository } from '../../../../src/Contexts/Assignment/domain/AssignmentRepository';
import { Assignment } from '../../../../src/Contexts/Assignment/domain/Assignment';
import { AssignmentId } from '../../../../src/Contexts/Assignment/domain/AssignmentId';
import { OfferRepository } from '../../../../src/Contexts/Offer/domain/OfferRepository';
import { Offer } from '../../../../src/Contexts/Offer/domain/Offer';
import { OfferId } from '../../../../src/Contexts/Offer/domain/OfferId';
import { JobRepository } from '../../../../src/Contexts/Job/domain/JobRepository';
import { Job } from '../../../../src/Contexts/Job/domain/Job';
import { JobId } from '../../../../src/Contexts/Job/domain/JobId';
import { ClientId } from '../../../../src/Contexts/Job/domain/ClientId';
import { ProfessionalId } from '../../../../src/Contexts/Offer/domain/ProfessionalId';
import { Zone } from '../../../../src/Contexts/Professional/domain/Zone';
import { Category } from '../../../../src/Contexts/Professional/domain/Category';
import { Nullable } from '../../../../src/Contexts/Shared/domain/Nullable';
import { InvalidArgumentError } from '../../../../src/Contexts/Shared/domain/value-object/InvalidArgumentError';
import { TransactionManager } from '../../../../src/Contexts/Shared/domain/TransactionManager';

class RecordingTransactionManager implements TransactionManager {
  readonly events: string[] = [];

  async run<T>(work: () => Promise<T>): Promise<T> {
    this.events.push('enter');
    try {
      return await work();
    } finally {
      this.events.push('exit');
    }
  }
}

class InMemoryAssignmentRepository implements AssignmentRepository {
  private readonly assignments: Assignment[] = [];

  async save(assignment: Assignment): Promise<void> {
    const existingIndex = this.assignments.findIndex(a => a.id.value === assignment.id.value);
    if (existingIndex >= 0) {
      this.assignments[existingIndex] = assignment;
    } else {
      this.assignments.push(assignment);
    }
  }

  async findById(id: AssignmentId): Promise<Nullable<Assignment>> {
    return this.assignments.find(assignment => assignment.id.value === id.value) ?? null;
  }

  async findByOfferId(offerId: OfferId): Promise<Nullable<Assignment>> {
    return this.assignments.find(assignment => assignment.offerId.value === offerId.value) ?? null;
  }

  saved(): Assignment[] {
    return this.assignments;
  }
}

class InMemoryOfferRepository implements OfferRepository {
  private readonly offers: Offer[] = [];

  async save(offer: Offer): Promise<void> {
    const existingIndex = this.offers.findIndex(o => o.id.value === offer.id.value);
    if (existingIndex >= 0) {
      this.offers[existingIndex] = offer;
    } else {
      this.offers.push(offer);
    }
  }

  async findById(id: OfferId): Promise<Nullable<Offer>> {
    return this.offers.find(offer => offer.id.value === id.value) ?? null;
  }

  async findByIdForUpdate(id: OfferId): Promise<Nullable<Offer>> {
    return this.offers.find(offer => offer.id.value === id.value) ?? null;
  }

  async findPendingByJobAndProfessional(jobId: JobId, professionalId: ProfessionalId): Promise<Nullable<Offer>> {
    return (
      this.offers.find(
        offer =>
          offer.jobId.value === jobId.value && offer.professionalId.value === professionalId.value && offer.isPending()
      ) ?? null
    );
  }

  saved(): Offer[] {
    return this.offers;
  }
}

class InMemoryJobRepository implements JobRepository {
  private readonly jobs: Job[] = [];
  readonly lockedJobIds: string[] = [];

  async save(job: Job): Promise<void> {
    const existingIndex = this.jobs.findIndex(j => j.id.value === job.id.value);
    if (existingIndex >= 0) {
      this.jobs[existingIndex] = job;
    } else {
      this.jobs.push(job);
    }
  }

  async findById(id: JobId): Promise<Nullable<Job>> {
    return this.jobs.find(job => job.id.value === id.value) ?? null;
  }

  async findByIdForUpdate(id: JobId): Promise<Nullable<Job>> {
    this.lockedJobIds.push(id.value);
    return this.jobs.find(job => job.id.value === id.value) ?? null;
  }

  async findOpenByZoneAndCategory(zone: Zone, category: Category): Promise<Job[]> {
    return [];
  }

  addJob(job: Job): void {
    this.jobs.push(job);
  }

  saved(): Job[] {
    return this.jobs;
  }
}

describe('AcceptOffer', () => {
  const assignmentId = 'e7a62f43-9b82-4c01-8d26-7ab950e82431';
  const offerId = '9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a';
  const jobId = '4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f';
  const professionalId = '0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b';
  const clientId = '6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d';

  it('happy path accepts the offer, moves the job to ASSIGNED, creates an ACTIVE assignment with professionalId from the offer and clientId from the job, and returns its primitives', async () => {
    const transactionManager = new RecordingTransactionManager();
    const assignmentRepository = new InMemoryAssignmentRepository();
    const offerRepository = new InMemoryOfferRepository();
    const jobRepository = new InMemoryJobRepository();

    const job = Job.create(new JobId(jobId), new ClientId(clientId), 'Fix the kitchen sink', 'The sink leaks', new Zone('palermo'), new Category('plumbing'), '1000-2000');
    jobRepository.addJob(job);

    const offer = Offer.create(new OfferId(offerId), new JobId(jobId), new ProfessionalId(professionalId), 'I can fix it', '1500');
    offerRepository.save(offer);

    const acceptOffer = new AcceptOffer(transactionManager, assignmentRepository, offerRepository, jobRepository);

    const primitives = await acceptOffer.run(assignmentId, offerId);

    expect(transactionManager.events).toEqual(['enter', 'exit']);
    expect(jobRepository.lockedJobIds).toEqual([jobId]);
    expect(offerRepository.saved()[0].toPrimitives().status).toBe('ACCEPTED');
    expect(jobRepository.saved()[0].toPrimitives().status).toBe('ASSIGNED');
    expect(assignmentRepository.saved()[0].toPrimitives()).toEqual({
      id: assignmentId,
      jobId,
      offerId,
      professionalId,
      clientId,
      status: 'ACTIVE'
    });
    expect(primitives).toEqual({
      id: assignmentId,
      jobId,
      offerId,
      professionalId,
      clientId,
      status: 'ACTIVE'
    });
  });

  it('runs the whole flow inside the transaction even when it throws', async () => {
    const transactionManager = new RecordingTransactionManager();
    const assignmentRepository = new InMemoryAssignmentRepository();
    const offerRepository = new InMemoryOfferRepository();
    const jobRepository = new InMemoryJobRepository();

    const acceptOffer = new AcceptOffer(transactionManager, assignmentRepository, offerRepository, jobRepository);

    await expect(acceptOffer.run(assignmentId, offerId)).rejects.toThrow(InvalidArgumentError);

    expect(transactionManager.events).toEqual(['enter', 'exit']);
  });

  it('throws when the offer does not exist', async () => {
    const transactionManager = new RecordingTransactionManager();
    const assignmentRepository = new InMemoryAssignmentRepository();
    const offerRepository = new InMemoryOfferRepository();
    const jobRepository = new InMemoryJobRepository();

    const acceptOffer = new AcceptOffer(transactionManager, assignmentRepository, offerRepository, jobRepository);

    await expect(acceptOffer.run(assignmentId, offerId)).rejects.toThrow(InvalidArgumentError);
    await expect(acceptOffer.run(assignmentId, offerId)).rejects.toThrow(`The Offer <${offerId}> does not exist`);

    expect(assignmentRepository.saved()).toHaveLength(0);
    expect(offerRepository.saved()).toHaveLength(0);
    expect(jobRepository.saved()).toHaveLength(0);
  });

  it('throws when the offer is already ACCEPTED', async () => {
    const transactionManager = new RecordingTransactionManager();
    const assignmentRepository = new InMemoryAssignmentRepository();
    const offerRepository = new InMemoryOfferRepository();
    const jobRepository = new InMemoryJobRepository();

    const job = Job.create(new JobId(jobId), new ClientId(clientId), 'Fix the kitchen sink', 'The sink leaks', new Zone('palermo'), new Category('plumbing'), '1000-2000');
    jobRepository.addJob(job);

    const offer = Offer.create(new OfferId(offerId), new JobId(jobId), new ProfessionalId(professionalId), 'I can fix it', '1500');
    offer.accept();
    offerRepository.save(offer);

    const acceptOffer = new AcceptOffer(transactionManager, assignmentRepository, offerRepository, jobRepository);

    await expect(acceptOffer.run(assignmentId, offerId)).rejects.toThrow(`The Offer <${offerId}> is not pending`);

    expect(assignmentRepository.saved()).toHaveLength(0);
  });

  it('throws when the job does not exist', async () => {
    const transactionManager = new RecordingTransactionManager();
    const assignmentRepository = new InMemoryAssignmentRepository();
    const offerRepository = new InMemoryOfferRepository();
    const jobRepository = new InMemoryJobRepository();

    const offer = Offer.create(new OfferId(offerId), new JobId(jobId), new ProfessionalId(professionalId), 'I can fix it', '1500');
    (offerRepository as any).offers.push(offer);

    const acceptOffer = new AcceptOffer(transactionManager, assignmentRepository, offerRepository, jobRepository);

    await expect(acceptOffer.run(assignmentId, offerId)).rejects.toThrow(`The Job <${jobId}> does not exist`);

    expect(assignmentRepository.saved()).toHaveLength(0);
    expect(jobRepository.saved()).toHaveLength(0);
  });

  it('throws when the job is already ASSIGNED', async () => {
    const transactionManager = new RecordingTransactionManager();
    const assignmentRepository = new InMemoryAssignmentRepository();
    const offerRepository = new InMemoryOfferRepository();
    const jobRepository = new InMemoryJobRepository();

    const job = Job.create(new JobId(jobId), new ClientId(clientId), 'Fix the kitchen sink', 'The sink leaks', new Zone('palermo'), new Category('plumbing'), '1000-2000');
    job.assign();
    jobRepository.addJob(job);

    const offer = Offer.create(new OfferId(offerId), new JobId(jobId), new ProfessionalId(professionalId), 'I can fix it', '1500');
    offerRepository.save(offer);

    const acceptOffer = new AcceptOffer(transactionManager, assignmentRepository, offerRepository, jobRepository);

    await expect(acceptOffer.run(assignmentId, offerId)).rejects.toThrow(`The Job <${jobId}> cannot be assigned`);

    expect(assignmentRepository.saved()).toHaveLength(0);
  });

  it('throws when the offer already has an assignment', async () => {
    const transactionManager = new RecordingTransactionManager();
    const assignmentRepository = new InMemoryAssignmentRepository();
    const offerRepository = new InMemoryOfferRepository();
    const jobRepository = new InMemoryJobRepository();

    const job = Job.create(new JobId(jobId), new ClientId(clientId), 'Fix the kitchen sink', 'The sink leaks', new Zone('palermo'), new Category('plumbing'), '1000-2000');
    jobRepository.addJob(job);

    const offer = Offer.create(new OfferId(offerId), new JobId(jobId), new ProfessionalId(professionalId), 'I can fix it', '1500');
    offerRepository.save(offer);

    const { JobId: AssignmentJobId } = require('../../../../src/Contexts/Assignment/domain/JobId');
    const { OfferId: AssignmentOfferId } = require('../../../../src/Contexts/Assignment/domain/OfferId');
    const { ProfessionalId: AssignmentProfessionalId } = require('../../../../src/Contexts/Assignment/domain/ProfessionalId');
    const { ClientId: AssignmentClientId } = require('../../../../src/Contexts/Assignment/domain/ClientId');
    assignmentRepository.save(
      Assignment.create(new AssignmentId(assignmentId), new AssignmentJobId(jobId), new AssignmentOfferId(offerId), new AssignmentProfessionalId(professionalId), new AssignmentClientId(clientId))
    );

    const acceptOffer = new AcceptOffer(transactionManager, assignmentRepository, offerRepository, jobRepository);

    await expect(acceptOffer.run(assignmentId, offerId)).rejects.toThrow(`The Offer <${offerId}> already has an assignment`);

    expect(assignmentRepository.saved()).toHaveLength(1);
  });
});
