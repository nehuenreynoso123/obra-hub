import { AuthUser } from './AuthUser';
import { AuthUserEmail } from './AuthUserEmail';
import { Nullable } from '../../Shared/domain/Nullable';

export interface AuthUserRepository {
  save(user: AuthUser): Promise<void>;
  findByEmail(email: AuthUserEmail): Promise<Nullable<AuthUser>>;
}
