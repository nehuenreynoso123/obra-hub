import { AggregateRoot } from '../../Shared/domain/AggregateRoot';
import { ProfessionalId } from './ProfessionalId';
import { AuthUserId } from '../../Auth/domain/AuthUserId';
import { Phone } from './Phone';
import { Zone } from './Zone';
import { Category } from './Category';
import { ProfessionalStatus } from './ProfessionalStatus';

export type ProfessionalPrimitives = {
  id: string;
  authUserId: string;
  name: string;
  phone: string;
  zone: string;
  category: string;
  status: string;
  description?: string | null;
};

export class Professional extends AggregateRoot {
  readonly id: ProfessionalId;
  readonly authUserId: AuthUserId;
  readonly name: string;
  phone: Phone;
  zone: Zone;
  category: Category;
  status: ProfessionalStatus;
  description: string | null;

  constructor(
    id: ProfessionalId,
    authUserId: AuthUserId,
    name: string,
    phone: Phone,
    zone: Zone,
    category: Category,
    status: ProfessionalStatus,
    description: string | null = null
  ) {
    super();
    this.id = id;
    this.authUserId = authUserId;
    this.name = name;
    this.phone = phone;
    this.zone = zone;
    this.category = category;
    this.status = status;
    this.description = description;
  }

  static create(
    id: ProfessionalId,
    authUserId: AuthUserId,
    name: string,
    phone: Phone,
    zone: Zone,
    category: Category
  ): Professional {
    return new Professional(id, authUserId, name, phone, zone, category, ProfessionalStatus.pending(), null);
  }

  completeProfile(zone: Zone, category: Category, description: string | null = null): void {
    this.zone = zone;
    this.category = category;
    this.description = description;
  }

  activate(): void {
    this.status = ProfessionalStatus.active();
  }

  suspend(): void {
    this.status = ProfessionalStatus.suspended();
  }

  isActive(): boolean {
    return this.status.isActive();
  }

  static fromPrimitives(plainData: ProfessionalPrimitives): Professional {
    return new Professional(
      new ProfessionalId(plainData.id),
      new AuthUserId(plainData.authUserId),
      plainData.name,
      new Phone(plainData.phone),
      new Zone(plainData.zone),
      new Category(plainData.category),
      ProfessionalStatus.fromValue(plainData.status),
      plainData.description ?? null
    );
  }

  toPrimitives(): ProfessionalPrimitives {
    return {
      id: this.id.value,
      authUserId: this.authUserId.value,
      name: this.name,
      phone: this.phone.value,
      zone: this.zone.value,
      category: this.category.value,
      status: this.status.value,
      description: this.description
    };
  }
}
