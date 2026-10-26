import { CreateOffer } from '../../../../src/Contexts/Offer/application/Create/CreateOffer';
import { OfferRepository } from '../../../../src/Contexts/Offer/domain/OfferRepository';
import { JobRepository } from '../../../../src/Contexts/Job/domain/JobRepository';
import { Offer } from '../../../../src/Contexts/Offer/domain/Offer';
import { OfferId } from '../../../../src/Contexts/Offer/domain/OfferId';
import { JobId } from '../../../../src/Contexts/Job/domain/JobId';
import { Job } from '../../../../src/Contexts/Job/domain/Job';
import { ClientId } from '../../../../src/Contexts/Job/domain/ClientId';
import { Zone } from '../../../../src/Contexts/Professional/domain/Zone';
import { Category } from '../../../../src/Contexts/Professional/domain/Category';
import { ProfessionalId } from '../../../../src/Contexts/Offer/domain/ProfessionalId';
import { Nullable } from '../../../../src/Contexts/Shared/domain/Nullable';

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

  async findPendingByJobAndProfessional(jobId: JobId, professionalId: ProfessionalId): Promise<Nullable<Offer>> {
    return (
      this.offers.find(
        offer =>
          offer.jobId.value === jobId.value && offer.professionalId.value === professionalId.value && offer.isPending()
      ) ?? null
    );
  }

  savedOffers(): Offer[] {
    return this.offers;
  }
}

class InMemoryJobRepository implements JobRepository {
  private readonly jobs: Job[] = [];

  async save(job: Job): Promise<void> {
    this.jobs.push(job);
  }

  async findById(id: JobId): Promise<Nullable<Job>> {
    return this.jobs.find(job => job.id.value === id.value) ?? null;
  }

  async findOpenByZoneAndCategory(zone: Zone, category: Category): Promise<Job[]> {
    return [];
  }

  addJob(job: Job): void {
    this.jobs.push(job);
  }
}

describe('CreateOffer', () => {
  it('saves a PENDING offer with the given primitives', async () => {
    const offerRepository = new InMemoryOfferRepository();
    const jobRepository = new InMemoryJobRepository();
    const job = Job.create(
      new JobId('4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f'),
      new ClientId('6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d'),
      'Fix the kitchen sink',
      'The sink leaks under the cabinet',
      new Zone('palermo'),
      new Category('plumbing'),
      '1000-2000'
    );
    jobRepository.addJob(job);

    const createOffer = new CreateOffer(offerRepository, jobRepository);

    await createOffer.run(
      '9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a',
      '4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f',
      '0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b',
      'I can fix it this week',
      '1500'
    );

    const savedOffers = offerRepository.savedOffers();
    expect(savedOffers).toHaveLength(1);
    expect(savedOffers[0].toPrimitives()).toEqual({
      id: '9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a',
      jobId: '4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f',
      professionalId: '0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b',
      message: 'I can fix it this week',
      priceEstimate: '1500',
      status: 'PENDING'
    });
  });

  it('rejects when the job does not exist', async () => {
    const offerRepository = new InMemoryOfferRepository();
    const jobRepository = new InMemoryJobRepository();
    const createOffer = new CreateOffer(offerRepository, jobRepository);

    await expect(
      createOffer.run(
        '9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a',
        '4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f',
        '0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b',
        'I can fix it this week',
        '1500'
      )
    ).rejects.toThrow('The Job <4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f> does not exist');
  });

  it('rejects when the job is not OPEN (use an ASSIGNED job)', async () => {
    const offerRepository = new InMemoryOfferRepository();
    const jobRepository = new InMemoryJobRepository();
    const job = Job.create(
      new JobId('4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f'),
      new ClientId('6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d'),
      'Fix the kitchen sink',
      'The sink leaks under the cabinet',
      new Zone('palermo'),
      new Category('plumbing'),
      '1000-2000'
    );
    job.assign();
    jobRepository.addJob(job);

    const createOffer = new CreateOffer(offerRepository, jobRepository);

    await expect(
      createOffer.run(
        '9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a',
        '4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f',
        '0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b',
        'I can fix it this week',
        '1500'
      )
    ).rejects.toThrow('The Job <4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f> cannot receive offers');
  });

  it('rejects when a pending offer already exists for the same job+professional', async () => {
    const offerRepository = new InMemoryOfferRepository();
    const jobRepository = new InMemoryJobRepository();
    const job = Job.create(
      new JobId('4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f'),
      new ClientId('6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d'),
      'Fix the kitchen sink',
      'The sink leaks under the cabinet',
      new Zone('palermo'),
      new Category('plumbing'),
      '1000-2000'
    );
    jobRepository.addJob(job);

    const createOffer = new CreateOffer(offerRepository, jobRepository);
    await createOffer.run(
      '9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a',
      '4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f',
      '0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b',
      'I can fix it this week',
      '1500'
    );

    await expect(
      createOffer.run(
        '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
        '4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f',
        '0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b',
        'I can fix it again',
        '1600'
      )
    ).rejects.toThrow('A pending offer already exists for this job and professional');
  });

  it('accepts a fresh offer after a previous one was withdrawn', async () => {
    const offerRepository = new InMemoryOfferRepository();
    const jobRepository = new InMemoryJobRepository();
    const job = Job.create(
      new JobId('4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f'),
      new ClientId('6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d'),
      'Fix the kitchen sink',
      'The sink leaks under the cabinet',
      new Zone('palermo'),
      new Category('plumbing'),
      '1000-2000'
    );
    jobRepository.addJob(job);

    const createOffer = new CreateOffer(offerRepository, jobRepository);
    await createOffer.run(
      '9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a',
      '4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f',
      '0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b',
      'I can fix it this week',
      '1500'
    );

    const offer = offerRepository.savedOffers()[0];
    offer.withdraw();
    await offerRepository.save(offer);

    await createOffer.run(
      '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
      '4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f',
      '0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b',
      'I can fix it again',
      '1600'
    );

    expect(offerRepository.savedOffers()).toHaveLength(2);
    const pending = offerRepository.savedOffers().find(o => o.isPending());
    expect(pending?.toPrimitives().status).toBe('PENDING');
  });
});
