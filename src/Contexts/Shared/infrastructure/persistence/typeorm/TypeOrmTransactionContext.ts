import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from 'typeorm';

// Repositories resolve the active manager from here so they join the caller's transaction without changing their signatures.
export class TypeOrmTransactionContext {
  private static readonly storage = new AsyncLocalStorage<EntityManager>();

  static current(): EntityManager | undefined {
    return TypeOrmTransactionContext.storage.getStore();
  }

  static run<T>(manager: EntityManager, work: () => Promise<T>): Promise<T> {
    return TypeOrmTransactionContext.storage.run(manager, work);
  }
}
