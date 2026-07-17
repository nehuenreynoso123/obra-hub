import { EntitySchema } from 'typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmRepository } from '../../../../Shared/infrastructure/persistence/typeorm/TypeOrmRepository';
import { AuthUser } from '../../../domain/AuthUser';
import { AuthUserEmail } from '../../../domain/AuthUserEmail';
import { AuthUserRepository } from '../../../domain/AuthUserRepository';
import { AuthUserEntity } from './AuthUserEntity';

export class TypeOrmAuthUserRepository extends TypeOrmRepository<AuthUser> implements AuthUserRepository {
  constructor(client: Promise<DataSource>) {
    super(client);
  }

  protected entitySchema(): EntitySchema<AuthUser> {
    return AuthUserEntity;
  }

  async save(user: AuthUser): Promise<void> {
    await this.persist(user);
  }

  async findByEmail(email: AuthUserEmail): Promise<AuthUser | null> {
    const repository = await this.repository();
    const entity = await repository.findOne({ where: { email: email.value } as any });

    if (!entity) {
      return null;
    }

    return entity;
  }
}
