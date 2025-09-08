import { User } from './User';
import { UserId } from './UserId';
import { Nullable } from '../../../Shared/domain/Nullable';

export interface UserRepository {
  save(user: User): Promise<void>;
  search(id: UserId): Promise<Nullable<User>>;
}
