import { Assignment } from '../../../../src/Contexts/Assignment/domain/Assignment';
import { AssignmentId } from '../../../../src/Contexts/Assignment/domain/AssignmentId';
import { AssignmentStatus } from '../../../../src/Contexts/Assignment/domain/AssignmentStatus';
import { JobId } from '../../../../src/Contexts/Assignment/domain/JobId';
import { OfferId } from '../../../../src/Contexts/Assignment/domain/OfferId';
import { ProfessionalId } from '../../../../src/Contexts/Assignment/domain/ProfessionalId';
import { ClientId } from '../../../../src/Contexts/Assignment/domain/ClientId';
import { InvalidArgumentError } from '../../../../src/Contexts/Shared/domain/value-object/InvalidArgumentError';

describe('Assignment', () => {
  it('create starts ACTIVE', () => {
    const assignment = Assignment.create(
      new AssignmentId('e7a62f43-9b82-4c01-8d26-7ab950e82431'),
      new JobId('4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f'),
      new OfferId('9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a'),
      new ProfessionalId('0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b'),
      new ClientId('6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d')
    );

    expect(assignment.isActive()).toBe(true);
    expect(assignment.status.value).toBe(AssignmentStatus.active().value);
  });

  it('complete moves ACTIVE -> COMPLETED', () => {
    const assignment = Assignment.create(
      new AssignmentId('e7a62f43-9b82-4c01-8d26-7ab950e82431'),
      new JobId('4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f'),
      new OfferId('9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a'),
      new ProfessionalId('0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b'),
      new ClientId('6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d')
    );

    assignment.complete();

    expect(assignment.isCompleted()).toBe(true);
    expect(assignment.status.value).toBe(AssignmentStatus.completed().value);
  });

  it('complete throws on a COMPLETED assignment', () => {
    const assignment = Assignment.create(
      new AssignmentId('e7a62f43-9b82-4c01-8d26-7ab950e82431'),
      new JobId('4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f'),
      new OfferId('9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a'),
      new ProfessionalId('0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b'),
      new ClientId('6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d')
    );

    assignment.complete();

    expect(() => assignment.complete()).toThrow(InvalidArgumentError);
    expect(() => assignment.complete()).toThrow('Only active assignments can be completed');
  });

  it('cancel moves ACTIVE -> CANCELLED', () => {
    const assignment = Assignment.create(
      new AssignmentId('e7a62f43-9b82-4c01-8d26-7ab950e82431'),
      new JobId('4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f'),
      new OfferId('9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a'),
      new ProfessionalId('0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b'),
      new ClientId('6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d')
    );

    assignment.cancel();

    expect(assignment.status.value).toBe(AssignmentStatus.cancelled().value);
  });

  it('fromPrimitives/toPrimitives round-trip', () => {
    const primitives = {
      id: 'e7a62f43-9b82-4c01-8d26-7ab950e82431',
      jobId: '4f0a5e6c-1d2b-4c3d-8e9f-0a1b2c3d4e5f',
      offerId: '9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a',
      professionalId: '0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b',
      clientId: '6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d',
      status: 'ACTIVE'
    };

    const assignment = Assignment.fromPrimitives(primitives);

    expect(assignment.toPrimitives()).toEqual(primitives);
  });
});
