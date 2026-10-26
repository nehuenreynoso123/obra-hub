import { EntitySchema } from 'typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmRepository } from '../../../../Shared/infrastructure/persistence/typeorm/TypeOrmRepository';
import { Offer } from '../../../domain/Offer';
import { OfferRepository } from '../../../domain/OfferRepository';
import { OfferId } from '../../../domain/OfferId';
import { JobId } from '../../../domain/JobId';
import { ProfessionalId } from '../../../domain/ProfessionalId';
import { OfferStatus } from '../../../domain/OfferStatus';
import { OfferEntity } from './OfferEntity';

export class TypeOrmOfferRepository extends TypeOrmRepository<Offer> implements OfferRepository {
  constructor(client: Promise<DataSource>) {
    super(client);
  }

  protected entitySchema(): EntitySchema<Offer> {
    return OfferEntity;
  }

  async save(offer: Offer): Promise<void> {
    await this.persist(offer);
  }

  async findById(id: OfferId): Promise<Offer | null> {
    const repository = await this.repository();
    const entity = await repository.findOne({ where: { id: id.value } as any });

    if (!entity) {
      return null;
    }

    return this.fromEntity(entity);
  }

  async findByIdForUpdate(id: OfferId): Promise<Offer | null> {
    const repository = await this.repository();
    const entity = await repository.findOne({
      where: { id: id.value } as any,
      lock: { mode: 'pessimistic_write' }
    });

    if (!entity) {
      return null;
    }

    return this.fromEntity(entity);
  }

  async findPendingByJobAndProfessional(jobId: JobId, professionalId: ProfessionalId): Promise<Offer | null> {
    const repository = await this.repository();
    const entity = await repository.findOne({
      where: { jobId: jobId.value, professionalId: professionalId.value, status: OfferStatus.pending().value } as any
    });

    if (!entity) {
      return null;
    }

    return this.fromEntity(entity);
  }

  private fromEntity(entity: any): Offer {
    return Offer.fromPrimitives({
      id: entity.id,
      jobId: entity.jobId,
      professionalId: entity.professionalId,
      message: entity.message,
      priceEstimate: entity.priceEstimate,
      status: entity.status
    });
  }
}
