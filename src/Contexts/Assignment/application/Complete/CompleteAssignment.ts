import { AssignmentRepository } from '../../domain/AssignmentRepository';
import { AssignmentId } from '../../domain/AssignmentId';
import { InvalidArgumentError } from '../../../Shared/domain/value-object/InvalidArgumentError';

export class CompleteAssignment {
  constructor(private readonly repository: AssignmentRepository) {}

  async run(id: string): Promise<void> {
    const assignment = await this.repository.findById(new AssignmentId(id));

    if (!assignment) {
      throw new InvalidArgumentError(`The Assignment <${id}> does not exist`);
    }

    assignment.complete();

    await this.repository.save(assignment);
  }
}
