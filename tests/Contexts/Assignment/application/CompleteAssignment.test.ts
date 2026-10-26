import { CompleteAssignment } from '../../../../src/Contexts/Assignment/application/Complete/CompleteAssignment';
import { AssignmentRepository } from '../../../../src/Contexts/Assignment/domain/AssignmentRepository';
import { Assignment } from '../../../../src/Contexts/Assignment/domain/Assignment';
import { AssignmentId } from '../../../../src/Contexts/Assignment/domain/AssignmentId';
import { JobId } from '../../../../src/Contexts/Assignment/domain/JobId';
import { OfferId } from '../../../../src/Contexts/Assignment/domain/OfferId';
import { ProfessionalId } from '../../../../src/Contexts/Assignment/domain/ProfessionalId';
import { ClientId } from '../../../../src/Contexts/Assignment/domain/ClientId';
import { Nullable } from '../../../../src/Contexts/Shared/domain/Nullable';
import { InvalidArgumentError } from '../../../../src/Contexts/Shared/domain/value-object/InvalidArgumentError';

class InMemoryAssignmentRepository implements AssignmentRepository {
  private readonly assignments: Assignment[] = [];

  async save(assignment: Assignment): Promise<void> {
    const existingIndex = this.assignments.findIndex(a => a.id.value === assignment.id.value);
    if (existingIndex >= 0) {
      this.assignments[existingIndex] = assignment;
    } else {
      this.assignments.push(assignment);
    }
  }

  async findById(id: AssignmentId): Promise<Nullable<Assignment>> {
    return this.assignments.find(assignment => assignment.id.value === id.value) ?? null;
  }

  async findByOfferId(offerId: OfferId): Promise<Nullable<Assignment>> {
    return this.assignments.find(assignment => assignment.offerId.value === offerId.value) ?? null;
  }

  addAssignment(assignment: Assignment): void {
    this.assignments.push(assignment);
  }
}

describe('CompleteAssignment', () => {
  it('ACTIVE assignment becomes COMPLETED and is saved', async () => {
    const assignmentRepository = new InMemoryAssignmentRepository();
    const assignment = Assignment.create(
      new AssignmentId('e7a62f43-9b82-4c01-8d26-7ab950e82431'),
      new JobId('4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f'),
      new OfferId('9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a'),
      new ProfessionalId('0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b'),
      new ClientId('6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d')
    );
    assignmentRepository.addAssignment(assignment);

    const completeAssignment = new CompleteAssignment(assignmentRepository);

    await completeAssignment.run('e7a62f43-9b82-4c01-8d26-7ab950e82431');

    expect(assignment.isCompleted()).toBe(true);
  });

  it('unknown id throws InvalidArgumentError', async () => {
    const assignmentRepository = new InMemoryAssignmentRepository();
    const completeAssignment = new CompleteAssignment(assignmentRepository);

    await expect(completeAssignment.run('e7a62f43-9b82-4c01-8d26-7ab950e82431')).rejects.toThrow(InvalidArgumentError);
    await expect(completeAssignment.run('e7a62f43-9b82-4c01-8d26-7ab950e82431')).rejects.toThrow(
      'The Assignment <e7a62f43-9b82-4c01-8d26-7ab950e82431> does not exist'
    );
  });
});
