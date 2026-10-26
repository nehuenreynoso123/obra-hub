import { EntitySchema } from 'typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmRepository } from '../../../../Shared/infrastructure/persistence/typeorm/TypeOrmRepository';
import { Job } from '../../../domain/Job';
import { JobRepository } from '../../../domain/JobRepository';
import { JobId } from '../../../domain/JobId';
import { JobStatus } from '../../../domain/JobStatus';
import { Zone } from '../../../../Professional/domain/Zone';
import { Category } from '../../../../Professional/domain/Category';
import { JobEntity } from './JobEntity';

export class TypeOrmJobRepository extends TypeOrmRepository<Job> implements JobRepository {
  constructor(client: Promise<DataSource>) {
    super(client);
  }

  protected entitySchema(): EntitySchema<Job> {
    return JobEntity;
  }

  async save(job: Job): Promise<void> {
    await this.persist(job);
  }

  async findById(id: JobId): Promise<Job | null> {
    const repository = await this.repository();
    const entity = await repository.findOne({ where: { id: id.value } as any });

    if (!entity) {
      return null;
    }

    return this.fromEntity(entity);
  }

  async findOpenByZoneAndCategory(zone: Zone, category: Category): Promise<Job[]> {
    const repository = await this.repository();
    const entities = await repository.find({
      where: { zone: zone.value, category: category.value, status: JobStatus.open().value } as any
    });

    if (entities.length === 0) {
      return [];
    }

    return entities.map(entity => this.fromEntity(entity));
  }

  private fromEntity(entity: any): Job {
    return Job.fromPrimitives({
      id: entity.id,
      clientId: entity.clientId,
      title: entity.title,
      description: entity.description,
      zone: entity.zone,
      category: entity.category,
      budgetRange: entity.budgetRange,
      status: entity.status
    });
  }
}
