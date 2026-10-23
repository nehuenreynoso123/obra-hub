import { EntitySchema } from 'typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmRepository } from '../../../../Shared/infrastructure/persistence/typeorm/TypeOrmRepository';
import { Professional } from '../../../domain/Professional';
import { ProfessionalRepository } from '../../../domain/ProfessionalRepository';
import { ProfessionalId } from '../../../domain/ProfessionalId';
import { AuthUserId } from '../../../../Auth/domain/AuthUserId';
import { ProfessionalEntity } from './ProfessionalEntity';

export class TypeOrmProfessionalRepository extends TypeOrmRepository<Professional> implements ProfessionalRepository {
  constructor(client: Promise<DataSource>) {
    super(client);
  }

  protected entitySchema(): EntitySchema<Professional> {
    return ProfessionalEntity;
  }

  async save(professional: Professional): Promise<void> {
    await this.persist(professional);
  }

  async findById(id: ProfessionalId): Promise<Professional | null> {
    const repository = await this.repository();
    const entity = await repository.findOne({ where: { id: id.value } as any });

    if (!entity) {
      return null;
    }

    return this.fromEntity(entity);
  }

  async findByAuthUserId(authUserId: AuthUserId): Promise<Professional | null> {
    const repository = await this.repository();
    const entity = await repository.findOne({ where: { authUserId: authUserId.value } as any });

    if (!entity) {
      return null;
    }

    return this.fromEntity(entity);
  }

  private fromEntity(entity: any): Professional {
    return Professional.fromPrimitives({
      id: entity.id,
      authUserId: entity.authUserId,
      name: entity.name,
      phone: entity.phone,
      zone: entity.zone,
      category: entity.category,
      status: entity.status,
      description: entity.description
    });
  }
}
