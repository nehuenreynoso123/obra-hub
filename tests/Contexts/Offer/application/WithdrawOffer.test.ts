import { WithdrawOffer } from '../../../../src/Contexts/Offer/application/Withdraw/WithdrawOffer';
import { OfferRepository } from '../../../../src/Contexts/Offer/domain/OfferRepository';
import { Offer } from '../../../../src/Contexts/Offer/domain/Offer';
import { OfferId } from '../../../../src/Contexts/Offer/domain/OfferId';
import { JobId } from '../../../../src/Contexts/Offer/domain/JobId';
import { ProfessionalId } from '../../../../src/Contexts/Offer/domain/ProfessionalId';
import { Nullable } from '../../../../src/Contexts/Shared/domain/Nullable';
import { InvalidArgumentError } from '../../../../src/Contexts/Shared/domain/value-object/InvalidArgumentError';
import { TransactionManager } from '../../../../src/Contexts/Shared/domain/TransactionManager';

class InMemoryTransactionManager implements TransactionManager {
  async run<T>(work: () => Promise<T>): Promise<T> {
    return work();
  }
}

class InMemoryOfferRepository implements OfferRepository {
  private readonly offers: Offer[] = [];

  async save(offer: Offer): Promise<void> {
    const existingIndex = this.offers.findIndex(o => o.id.value === offer.id.value);
    if (existingIndex >= 0) {
      this.offers[existingIndex] = offer;
    } else {
      this.offers.push(offer);
    }
  }

  async findById(id: OfferId): Promise<Nullable<Offer>> {
    return this.offers.find(offer => offer.id.value === id.value) ?? null;
  }

  async findByIdForUpdate(id: OfferId): Promise<Nullable<Offer>> {
    return this.offers.find(offer => offer.id.value === id.value) ?? null;
  }

  async findPendingByJobAndProfessional(jobId: JobId, professionalId: ProfessionalId): Promise<Nullable<Offer>> {
    return (
      this.offers.find(
        offer =>
          offer.jobId.value === jobId.value && offer.professionalId.value === professionalId.value && offer.isPending()
      ) ?? null
    );
  }

  addOffer(offer: Offer): void {
    this.offers.push(offer);
  }

  savedOffers(): Offer[] {
    return this.offers;
  }
}

describe('WithdrawOffer', () => {
  it('PENDING offer becomes WITHDRAWN and is saved', async () => {
    const transactionManager = new InMemoryTransactionManager();
    const repository = new InMemoryOfferRepository();
    const offer = Offer.create(
      new OfferId('9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a'),
      new JobId('4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f'),
      new ProfessionalId('0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b'),
      'I can fix it this week',
      '1500'
    );
    repository.addOffer(offer);

    const withdrawOffer = new WithdrawOffer(transactionManager, repository);
    await withdrawOffer.run('9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a');

    expect(repository.savedOffers()[0].toPrimitives().status).toBe('WITHDRAWN');
  });

  it('an ACCEPTED offer throws InvalidArgumentError and nothing is saved', async () => {
    const transactionManager = new InMemoryTransactionManager();
    const repository = new InMemoryOfferRepository();
    const offer = Offer.create(
      new OfferId('9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a'),
      new JobId('4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f'),
      new ProfessionalId('0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b'),
      'I can fix it this week',
      '1500'
    );
    offer.accept();
    repository.addOffer(offer);
    const savedBefore = repository.savedOffers().length;

    const withdrawOffer = new WithdrawOffer(transactionManager, repository);
    await expect(withdrawOffer.run('9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a')).rejects.toThrow(InvalidArgumentError);

    expect(repository.savedOffers()).toHaveLength(savedBefore);
  });

  it('unknown id throws InvalidArgumentError', async () => {
    const transactionManager = new InMemoryTransactionManager();
    const repository = new InMemoryOfferRepository();
    const withdrawOffer = new WithdrawOffer(transactionManager, repository);
    await expect(withdrawOffer.run('9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a')).rejects.toThrow(InvalidArgumentError);
  });
});
