import bcrypt from 'bcrypt';
import { PasswordHasher } from '../domain/PasswordHasher';

const SALT_ROUNDS = 10;

export class BCryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }
}
