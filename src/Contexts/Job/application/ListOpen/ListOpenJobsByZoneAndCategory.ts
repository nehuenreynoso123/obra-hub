import { JobRepository } from '../../domain/JobRepository';
import { JobPrimitives } from '../../domain/Job';
import { Zone } from '../../../Professional/domain/Zone';
import { Category } from '../../../Professional/domain/Category';

export class ListOpenJobsByZoneAndCategory {
  constructor(private readonly repository: JobRepository) {}

  async run(zone: string, category: string): Promise<JobPrimitives[]> {
    const jobs = await this.repository.findOpenByZoneAndCategory(new Zone(zone), new Category(category));

    return jobs.map(job => job.toPrimitives());
  }
}
