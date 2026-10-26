import { EntitySchema } from 'typeorm';

export const OfferEntity = new EntitySchema<any>({
  name: 'offer',
  tableName: 'offers',
  columns: {
    id: {
      type: String,
      primary: true
    },
    jobId: {
      name: 'job_id',
      type: String
    },
    professionalId: {
      name: 'professional_id',
      type: String
    },
    message: {
      type: String
    },
    priceEstimate: {
      name: 'price_estimate',
      type: String,
      nullable: true
    },
    status: {
      type: String
    }
  },
  indices: [
    {
      name: 'idx_offers_job_id',
      columns: ['jobId']
    },
    {
      name: 'idx_offers_job_professional',
      columns: ['jobId', 'professionalId']
    }
  ]
});
