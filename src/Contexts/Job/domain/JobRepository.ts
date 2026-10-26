import { Job } from './Job';
import { JobId } from './JobId';
import { Zone } from '../../Professional/domain/Zone';
import { Category } from '../../Professional/domain/Category';
import { Nullable } from '../../Shared/domain/Nullable';

export interface JobRepository {
  save(job: Job): Promise<void>;
  findById(id: JobId): Promise<Nullable<Job>>;
  findOpenByZoneAndCategory(zone: Zone, category: Category): Promise<Job[]>;
}
