import { EntitySchema } from 'typeorm';

export const JobEntity = new EntitySchema<any>({
  name: 'job',
  tableName: 'jobs',
  columns: {
    id: {
      type: String,
      primary: true
    },
    clientId: {
      name: 'client_id',
      type: String
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    zone: {
      type: String
    },
    category: {
      type: String
    },
    budgetRange: {
      name: 'budget_range',
      type: String,
      nullable: true
    },
    status: {
      type: String
    }
  },
  indices: [
    {
      name: 'idx_jobs_zone_category',
      columns: ['zone', 'category']
    },
    {
      name: 'idx_jobs_client_id',
      columns: ['clientId']
    }
  ]
});
