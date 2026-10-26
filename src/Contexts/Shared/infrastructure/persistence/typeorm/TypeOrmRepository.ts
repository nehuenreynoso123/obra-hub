import { DataSource, EntitySchema, Repository } from 'typeorm';
import { AggregateRoot } from '../../../domain/AggregateRoot';
import { TypeOrmTransactionContext } from './TypeOrmTransactionContext';

export abstract class TypeOrmRepository<T extends AggregateRoot> {
  constructor(private _client: Promise<DataSource>) {}

  protected abstract entitySchema(): EntitySchema<T>;

  protected client(): Promise<DataSource> {
    return this._client;
  }

  protected async repository(): Promise<Repository<T>> {
    const activeManager = TypeOrmTransactionContext.current();

    if (activeManager) {
      return activeManager.getRepository(this.entitySchema());
    }

    return (await this._client).getRepository(this.entitySchema());
  }

  protected async persist(aggregateRoot: T): Promise<void> {
    const repository = await this.repository();
    await repository.save(aggregateRoot as any);
  }
}
