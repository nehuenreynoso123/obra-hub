import { EntityManager } from 'typeorm';
import { TypeOrmTransactionContext } from '../../../../../../src/Contexts/Shared/infrastructure/persistence/typeorm/TypeOrmTransactionContext';

describe('TypeOrmTransactionContext', () => {
  it('returns undefined outside any run', () => {
    expect(TypeOrmTransactionContext.current()).toBeUndefined();
  });

  it('returns the given manager inside run', async () => {
    const manager = {} as EntityManager;

    const observed = await TypeOrmTransactionContext.run(manager, async () => TypeOrmTransactionContext.current());

    expect(observed).toBe(manager);
  });

  it('does not leak managers between two overlapping runs', async () => {
    const firstManager = {} as EntityManager;
    const secondManager = {} as EntityManager;

    const first = TypeOrmTransactionContext.run(firstManager, async () => {
      const before = TypeOrmTransactionContext.current();
      await Promise.resolve();
      const after = TypeOrmTransactionContext.current();
      return [before, after];
    });

    const second = TypeOrmTransactionContext.run(secondManager, async () => {
      const before = TypeOrmTransactionContext.current();
      await Promise.resolve();
      const after = TypeOrmTransactionContext.current();
      return [before, after];
    });

    const [firstObserved, secondObserved] = await Promise.all([first, second]);

    expect(firstObserved).toEqual([firstManager, firstManager]);
    expect(secondObserved).toEqual([secondManager, secondManager]);
  });

  it('restores the context to undefined after run resolves', async () => {
    await TypeOrmTransactionContext.run({} as EntityManager, async () => undefined);

    expect(TypeOrmTransactionContext.current()).toBeUndefined();
  });

  it('restores the context to undefined after run rejects', async () => {
    await expect(
      TypeOrmTransactionContext.run({} as EntityManager, async () => {
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');

    expect(TypeOrmTransactionContext.current()).toBeUndefined();
  });
});
