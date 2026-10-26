import { OfferRepository } from '../../domain/OfferRepository';
import { OfferId } from '../../domain/OfferId';
import { InvalidArgumentError } from '../../../Shared/domain/value-object/InvalidArgumentError';

export class WithdrawOffer {
  constructor(private readonly repository: OfferRepository) {}

  async run(id: string): Promise<void> {
    const offer = await this.repository.findById(new OfferId(id));
    if (!offer) {
      throw new InvalidArgumentError(`The Offer <${id}> does not exist`);
    }

    offer.withdraw();
    await this.repository.save(offer);
  }
}
