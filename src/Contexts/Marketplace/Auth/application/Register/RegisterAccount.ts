import { Account } from '../../../Users/domain/User';
import { AccountId } from '../../../Users/domain/UserId';
import { AccountName } from '../../../Users/domain/UserName';
import { AccountEmail } from '../../../Users/domain/UserEmail';
import { AccountZone } from '../../../Users/domain/UserZone';
import { AccountPassword } from '../../../Users/domain/UserPassword';
import { AccountRepository } from '../../../Users/domain/UserRepository';
import { RegisterAccountRequest } from './RegisterAccountRequest';

export class RegisterAccount {
  constructor(private repository: AccountRepository) {}

  async run(request: RegisterAccountRequest): Promise<void> {
    const account = new Account(
      new AccountId(request.id),
      new AccountName(request.name),
      new AccountEmail(request.email),
      new AccountZone(request.zone),
      new AccountPassword(request.password)
    );
    return this.repository.save(account);
  }
}

//sin valueobject
/* export class AccountRegister {
  constructor(private Repository: AccountRepository) {}

  async run(id: string, name: string, email: string, zone: string, password: string) {
    const account = new Account(id, name, email, zone, password);

    return this.Repository.save(account);
  }
} */
