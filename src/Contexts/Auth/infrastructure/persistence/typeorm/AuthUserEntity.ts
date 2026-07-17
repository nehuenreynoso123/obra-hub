import { EntitySchema } from 'typeorm';
import { ValueObjectTransformer } from '../../../../Shared/infrastructure/persistence/typeorm/ValueObjectTransformer';
import { AuthUser } from '../../../domain/AuthUser';
import { AuthUserId } from '../../../domain/AuthUserId';
import { AuthUserEmail } from '../../../domain/AuthUserEmail';
import { AuthUserPassword } from '../../../domain/AuthUserPassword';
import { AuthUserName } from '../../../domain/AuthUserName';

export const AuthUserEntity = new EntitySchema<AuthUser>({
  name: 'AuthUser',
  tableName: 'auth_users',
  target: AuthUser,
  columns: {
    id: {
      type: String,
      primary: true,
      transformer: ValueObjectTransformer(AuthUserId)
    },
    email: {
      type: String,
      transformer: ValueObjectTransformer(AuthUserEmail)
    },
    password: {
      type: String,
      transformer: ValueObjectTransformer(AuthUserPassword)
    },
    name: {
      type: String,
      transformer: ValueObjectTransformer(AuthUserName)
    }
  }
});
