import { JobRepository } from '../../domain/JobRepository';
import { Job } from '../../domain/Job';
import { JobId } from '../../domain/JobId';
import { ClientId } from '../../domain/ClientId';
import { Zone } from '../../../Professional/domain/Zone';
import { Category } from '../../../Professional/domain/Category';

export class CreateJob {
  constructor(private readonly repository: JobRepository) {}

  async run(
    id: string,
    clientId: string,
    title: string,
    description: string,
    zone: string,
    category: string,
    budgetRange: string | null = null
  ): Promise<void> {
    const job = Job.create(
      new JobId(id),
      new ClientId(clientId),
      title,
      description,
      new Zone(zone),
      new Category(category),
      budgetRange
    );

    await this.repository.save(job);
  }
}
