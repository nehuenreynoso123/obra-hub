import { GetJobDetail } from '../../../../src/Contexts/Job/application/GetDetail/GetJobDetail';
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
}

describe('GetJobDetail', () => {
  it('returns the job primitives when the job exists', async () => {
    const repository = new InMemoryJobRepository();
    const job = Job.fromPrimitives({
      id: '9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a',
      clientId: '0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b',
      title: 'Fix the kitchen sink',
      description: 'The sink leaks under the cabinet',
      zone: 'palermo',
      category: 'plumbing',
      budgetRange: '1000-2000',
      status: 'OPEN'
    });
    await repository.save(job);

    const getJobDetail = new GetJobDetail(repository);
    const result = await getJobDetail.run(job.id.value);

    expect(result).toEqual(job.toPrimitives());
  });

  it('returns null when the job does not exist', async () => {
    const repository = new InMemoryJobRepository();
    const getJobDetail = new GetJobDetail(repository);

    const result = await getJobDetail.run('1f2a3b4c-5d6e-4f7a-8b9c-0d1e2f3a4b5c');

    expect(result).toBeNull();
  });
});
