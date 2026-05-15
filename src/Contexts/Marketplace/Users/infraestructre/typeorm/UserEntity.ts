import { EntitySchema } from 'typeorm';
import { ValueObjectTransformer } from '../../../../Shared/infrastructure/persistence/typeorm/ValueObjectTransformer';
import { UserId } from '../../domain/UserId';
import { User } from '../../domain/User';
import { UserEmail } from '../../domain/UserEmail';
import { UserName } from '../../domain/UserName';
import { UserPassword } from '../../domain/UserPassword';
import { UserZone } from '../../domain/UserZone';

export const AccountEntity = new EntitySchema<User>({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: String,
      primary: true,
      transformer: ValueObjectTransformer(UserId)
    },
    name: {
      type: String,
      transformer: ValueObjectTransformer(UserName)
    },
    email: {
      type: String,
      transformer: ValueObjectTransformer(UserEmail)
    },
    password: {
      type: String,
      transformer: ValueObjectTransformer(UserPassword)
    },
    zone: {
      type: String,
      transformer: ValueObjectTransformer(UserZone)
    }
  }
});
