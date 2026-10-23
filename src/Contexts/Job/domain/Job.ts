import { AggregateRoot } from '../../Shared/domain/AggregateRoot';
import { JobId } from './JobId';
import { ClientId } from './ClientId';
import { Zone } from '../../Professional/domain/Zone';
import { Category } from '../../Professional/domain/Category';
import { JobStatus } from './JobStatus';

export type JobPrimitives = {
  id: string;
  clientId: string;
  title: string;
  description: string;
  zone: string;
  category: string;
  budgetRange?: string | null;
  status: string;
};

export class Job extends AggregateRoot {
  readonly id: JobId;
  readonly clientId: ClientId;
  title: string;
  description: string;
  zone: Zone;
  category: Category;
  budgetRange: string | null;
  status: JobStatus;

  constructor(
    id: JobId,
    clientId: ClientId,
    title: string,
    description: string,
    zone: Zone,
    category: Category,
    budgetRange: string | null = null,
    status: JobStatus = JobStatus.open()
  ) {
    super();
    this.id = id;
    this.clientId = clientId;
    this.title = title;
    this.description = description;
    this.zone = zone;
    this.category = category;
    this.budgetRange = budgetRange;
    this.status = status;
  }

  static create(
    id: JobId,
    clientId: ClientId,
    title: string,
    description: string,
    zone: Zone,
    category: Category,
    budgetRange: string | null = null
  ): Job {
    return new Job(id, clientId, title, description, zone, category, budgetRange, JobStatus.open());
  }

  assign(): void {
    this.status = JobStatus.assigned();
  }

  close(): void {
    this.status = JobStatus.closed();
  }

  cancel(): void {
    this.status = JobStatus.cancelled();
  }

  isOpen(): boolean {
    return this.status.isOpen();
  }

  canReceiveOffer(): boolean {
    return this.status.canReceiveOffer();
  }

  static fromPrimitives(plainData: JobPrimitives): Job {
    return new Job(
      new JobId(plainData.id),
      new ClientId(plainData.clientId),
      plainData.title,
      plainData.description,
      new Zone(plainData.zone),
      new Category(plainData.category),
      plainData.budgetRange ?? null,
      JobStatus.fromValue(plainData.status)
    );
  }

  toPrimitives(): JobPrimitives {
    return {
      id: this.id.value,
      clientId: this.clientId.value,
      title: this.title,
      description: this.description,
      zone: this.zone.value,
      category: this.category.value,
      budgetRange: this.budgetRange,
      status: this.status.value
    };
  }
}
