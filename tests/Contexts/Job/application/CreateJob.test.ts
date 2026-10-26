import { CreateJob } from '../../../../src/Contexts/Job/application/Create/CreateJob';
import { Job } from '../../../../src/Contexts/Job/domain/Job';
import { JobId } from '../../../../src/Contexts/Job/domain/JobId';
import { JobRepository } from '../../../../src/Contexts/Job/domain/JobRepository';
import { Zone } from '../../../../src/Contexts/Professional/domain/Zone';
import { Category } from '../../../../src/Contexts/Professional/domain/Category';
import { Nullable } from '../../../../src/Contexts/Shared/domain/Nullable';

class InMemoryJobRepository implements JobRepository {
  private readonly jobs: Job[] = [];

  async save(job: Job): Promise<void> {
    this.jobs.push(job);
  }

  async findById(id: JobId): Promise<Nullable<Job>> {
    return this.jobs.find(job => job.id.value === id.value) ?? null;
  }

  async findByIdForUpdate(id: JobId): Promise<Nullable<Job>> {
    return this.jobs.find(job => job.id.value === id.value) ?? null;
  }

  async findOpenByZoneAndCategory(zone: Zone, category: Category): Promise<Job[]> {
    return this.jobs.filter(
      job => job.zone.value === zone.value && job.category.value === category.value && job.isOpen()
    );
  }

  savedJobs(): Job[] {
    return this.jobs;
  }
}

describe('CreateJob', () => {
  it('creates an open job and saves it', async () => {
    const repository = new InMemoryJobRepository();
    const createJob = new CreateJob(repository);

    await createJob.run(
      '4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f',
      '6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d',
      'Fix the kitchen sink',
      'The sink leaks under the cabinet',
      'palermo',
      'plumbing',
      '1000-2000'
    );

    const savedJobs = repository.savedJobs();

    expect(savedJobs).toHaveLength(1);
    expect(savedJobs[0].toPrimitives()).toEqual({
      id: '4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f',
      clientId: '6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d',
      title: 'Fix the kitchen sink',
      description: 'The sink leaks under the cabinet',
      zone: 'palermo',
      category: 'plumbing',
      budgetRange: '1000-2000',
      status: 'OPEN'
    });
    expect(savedJobs[0].isOpen()).toBe(true);
  });

  it('defaults budgetRange to null when it is not provided', async () => {
    const repository = new InMemoryJobRepository();
    const createJob = new CreateJob(repository);

    await createJob.run(
      '7b8c9d0e-1f2a-4b3c-8d4e-5f6a7b8c9d0e',
      '8c9d0e1f-2a3b-4c4d-9e5f-6a7b8c9d0e1f',
      'Paint the living room',
      'Two walls need a fresh coat of paint',
      'palermo',
      'painting'
    );

    expect(repository.savedJobs()[0].toPrimitives().budgetRange).toBeNull();
  });
});
