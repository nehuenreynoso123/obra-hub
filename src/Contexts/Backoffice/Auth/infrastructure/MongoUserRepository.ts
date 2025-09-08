import { Nullable } from '../../../Shared/domain/Nullable';
import { MongoRepository } from '../../../Shared/infrastructure/persistence/mongo/MongoRepository';
import { UserId } from '../domain/UserId';
import { User } from '../domain/User';
import { UserRepository } from '../domain/UserRepository';

interface UserDocument {
  _id: string;
  name: string;
  lastname: string;
  password: number;
}

export class MongoUserRepository extends MongoRepository<User> implements UserRepository {
  public save(user: User): Promise<void> {
    return this.persist(user.id.value, user);
  }

  public async search(id: UserId) {
    const collection = await this.collection();
    const document = await collection.findOne<UserDocument>({ _id: id.value });
    return document
      ? User.fromPrimitives({
          name: document.name,
          lastname: document.lastname,
          id: id.value,
          password: document.password
        })
      : null;
  }

  protected collectionName(): string {
    return 'users';
  }
}
