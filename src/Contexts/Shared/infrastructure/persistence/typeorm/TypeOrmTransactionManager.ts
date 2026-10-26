import { DataSource } from 'typeorm';
import { TransactionManager } from '../../../domain/TransactionManager';
import { TypeOrmTransactionContext } from './TypeOrmTransactionContext';

export class TypeOrmTransactionManager implements TransactionManager {
  constructor(private readonly client: Promise<DataSource>) {}

  async run<T>(work: () => Promise<T>): Promise<T> {
    const dataSource = await this.client;
    return dataSource.transaction(manager => TypeOrmTransactionContext.run(manager, work));
  }
}
