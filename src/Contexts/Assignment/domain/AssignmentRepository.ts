import { Assignment } from './Assignment';
import { AssignmentId } from './AssignmentId';
import { OfferId } from './OfferId';
import { Nullable } from '../../Shared/domain/Nullable';

export interface AssignmentRepository {
  save(assignment: Assignment): Promise<void>;
  findById(id: AssignmentId): Promise<Nullable<Assignment>>;
  findByOfferId(offerId: OfferId): Promise<Nullable<Assignment>>;
}
