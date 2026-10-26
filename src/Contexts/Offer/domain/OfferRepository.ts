import { Offer } from './Offer';
import { OfferId } from './OfferId';
import { JobId } from './JobId';
import { ProfessionalId } from './ProfessionalId';
import { Nullable } from '../../Shared/domain/Nullable';

export interface OfferRepository {
  save(offer: Offer): Promise<void>;
  findById(id: OfferId): Promise<Nullable<Offer>>;
  findPendingByJobAndProfessional(jobId: JobId, professionalId: ProfessionalId): Promise<Nullable<Offer>>;
}
