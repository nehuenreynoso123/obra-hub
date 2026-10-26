import { TransactionManager } from '../../../Shared/domain/TransactionManager';
import { OfferRepository } from '../../domain/OfferRepository';
import { OfferId } from '../../domain/OfferId';
import { InvalidArgumentError } from '../../../Shared/domain/value-object/InvalidArgumentError';

export class WithdrawOffer {
  constructor(
    private readonly transactionManager: TransactionManager,
    private readonly repository: OfferRepository
  ) {}

  async run(id: string): Promise<void> {
    return this.transactionManager.run(async () => {
      const offer = await this.repository.findByIdForUpdate(new OfferId(id));
      if (!offer) {
        throw new InvalidArgumentError(`The Offer <${id}> does not exist`);
      }

      offer.withdraw();
      await this.repository.save(offer);
    });
  }
}
