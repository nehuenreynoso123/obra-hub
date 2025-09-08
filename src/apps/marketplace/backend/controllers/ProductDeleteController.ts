import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from './Controller';
import { ProductDelete } from '../../../../Contexts/Marketplace/Products/application/Delete/ProductDelete';

type ProductDeleteRequest = Request & {
  query: {
    id: string;
  };
};

export class ProductDeleteController implements Controller {
  constructor(private productDelete: ProductDelete) {}
  async run(req: ProductDeleteRequest, res: Response) {
    try {
      const id = req.query.id;
      await this.productDelete.run(id);
      res.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
