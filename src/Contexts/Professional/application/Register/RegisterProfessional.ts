import { ProfessionalRepository } from '../../domain/ProfessionalRepository';
import { Professional } from '../../domain/Professional';
import { ProfessionalId } from '../../domain/ProfessionalId';
import { AuthUserId } from '../../../Auth/domain/AuthUserId';
import { Phone } from '../../domain/Phone';
import { Zone } from '../../domain/Zone';
import { Category } from '../../domain/Category';

export class RegisterProfessional {
  constructor(private readonly repository: ProfessionalRepository) {}

  async run(
    id: string,
    authUserId: string,
    name: string,
    phone: string,
    zone: string,
    category: string
  ): Promise<void> {
    const professional = Professional.create(
      new ProfessionalId(id),
      new AuthUserId(authUserId),
      name,
      new Phone(phone),
      new Zone(zone),
      new Category(category)
    );

    await this.repository.save(professional);
  }
}
