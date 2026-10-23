import { EntitySchema } from 'typeorm';

export const ProfessionalEntity = new EntitySchema<any>({
  name: 'professional',
  tableName: 'professionals',
  columns: {
    id: {
      type: String,
      primary: true
    },
    authUserId: {
      name: 'auth_user_id',
      type: String
    },
    name: {
      type: String
    },
    phone: {
      type: String
    },
    zone: {
      type: String
    },
    category: {
      type: String
    },
    status: {
      type: String
    },
    description: {
      type: String,
      nullable: true
    }
  },
  indices: [
    {
      name: 'idx_professionals_auth_user_id',
      columns: ['authUserId'],
      unique: true
    },
    {
      name: 'idx_professionals_zone_category',
      columns: ['zone', 'category']
    }
  ]
});
