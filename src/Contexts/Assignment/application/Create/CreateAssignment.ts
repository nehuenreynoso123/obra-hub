import { AssignmentRepository } from '../../domain/AssignmentRepository';
import { Assignment } from '../../domain/Assignment';
import { AssignmentId } from '../../domain/AssignmentId';
import { JobId } from '../../domain/JobId';
import { OfferId } from '../../domain/OfferId';
import { ProfessionalId } from '../../domain/ProfessionalId';
import { ClientId } from '../../domain/ClientId';

export class CreateAssignment {
  constructor(private readonly repository: AssignmentRepository) {}

  async run(id: string, jobId: string, offerId: string, professionalId: string, clientId: string): Promise<void> {
    const assignment = Assignment.create(
      new AssignmentId(id),
      new JobId(jobId),
      new OfferId(offerId),
      new ProfessionalId(professionalId),
      new ClientId(clientId)
    );

    await this.repository.save(assignment);
  }
}
