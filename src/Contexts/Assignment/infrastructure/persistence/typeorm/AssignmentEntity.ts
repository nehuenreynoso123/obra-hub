import { EntitySchema } from 'typeorm';

export const AssignmentEntity = new EntitySchema<any>({
  name: 'assignment',
  tableName: 'assignments',
  columns: {
    id: {
      type: String,
      primary: true
    },
    jobId: {
      name: 'job_id',
      type: String
    },
    offerId: {
      name: 'offer_id',
      type: String
    },
    professionalId: {
      name: 'professional_id',
      type: String
    },
    clientId: {
      name: 'client_id',
      type: String
    },
    status: {
      type: String
    }
  },
  indices: [
    {
      name: 'idx_assignments_job_id',
      columns: ['jobId'],
      unique: true
    },
    {
      name: 'idx_assignments_offer_id',
      columns: ['offerId'],
      unique: true
    },
    {
      name: 'idx_assignments_professional_id',
      columns: ['professionalId'],
      unique: false
    }
  ]
});
