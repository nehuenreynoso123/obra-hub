import { EntitySchema } from 'typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmRepository } from '../../../../Shared/infrastructure/persistence/typeorm/TypeOrmRepository';
import { Assignment } from '../../../domain/Assignment';
import { AssignmentRepository } from '../../../domain/AssignmentRepository';
import { AssignmentId } from '../../../domain/AssignmentId';
import { OfferId } from '../../../domain/OfferId';
import { AssignmentEntity } from './AssignmentEntity';

export class TypeOrmAssignmentRepository extends TypeOrmRepository<Assignment> implements AssignmentRepository {
  constructor(client: Promise<DataSource>) {
    super(client);
  }

  protected entitySchema(): EntitySchema<Assignment> {
    return AssignmentEntity;
  }

  async save(assignment: Assignment): Promise<void> {
    await this.persist(assignment);
  }

  async findById(id: AssignmentId): Promise<Assignment | null> {
    const repository = await this.repository();
    const entity = await repository.findOne({ where: { id: id.value } as any });

    if (!entity) {
      return null;
    }

    return this.fromEntity(entity);
  }

  async findByOfferId(offerId: OfferId): Promise<Assignment | null> {
    const repository = await this.repository();
    const entity = await repository.findOne({ where: { offerId: offerId.value } as any });

    if (!entity) {
      return null;
    }

    return this.fromEntity(entity);
  }

  private fromEntity(entity: any): Assignment {
    return Assignment.fromPrimitives({
      id: entity.id,
      jobId: entity.jobId,
      offerId: entity.offerId,
      professionalId: entity.professionalId,
      clientId: entity.clientId,
      status: entity.status
    });
  }
}
