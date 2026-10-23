import { Professional } from './Professional';
import { ProfessionalId } from './ProfessionalId';
import { AuthUserId } from '../../Auth/domain/AuthUserId';
import { Nullable } from '../../Shared/domain/Nullable';

export interface ProfessionalRepository {
  save(professional: Professional): Promise<void>;
  findById(id: ProfessionalId): Promise<Nullable<Professional>>;
  findByAuthUserId(authUserId: AuthUserId): Promise<Nullable<Professional>>;
}
