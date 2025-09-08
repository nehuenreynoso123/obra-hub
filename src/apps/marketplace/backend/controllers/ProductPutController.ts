import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ProductCreator } from '../../../../Contexts/Marketplace/Products/application/Create/ProductCreator';
import { Controller } from './Controller';

type ProductPutRequest = Request & {
  body: {
    id: string;
    name: string;
    descripcion: string;
    price: number;
  };
};

export class ProductPutController implements Controller {
  constructor(private productCreator: ProductCreator) {}

  async run(req: ProductPutRequest, res: Response) {
    try {
      const { id, name, description, price } = req.body;
      await this.productCreator.run({ id, name, description, price });
      res.status(httpStatus.CREATED).send();
    } catch {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
