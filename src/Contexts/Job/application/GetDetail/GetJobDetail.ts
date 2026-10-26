import { JobRepository } from '../../domain/JobRepository';
import { JobPrimitives } from '../../domain/Job';
import { JobId } from '../../domain/JobId';
import { Nullable } from '../../../Shared/domain/Nullable';

export class GetJobDetail {
  constructor(private readonly repository: JobRepository) {}

  async run(id: string): Promise<Nullable<JobPrimitives>> {
    const job = await this.repository.findById(new JobId(id));

    if (!job) {
      return null;
    }

    return job.toPrimitives();
  }
}
