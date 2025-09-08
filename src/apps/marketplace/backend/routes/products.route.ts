import { Router, Request, Response } from 'express';
import container from '../dependency-injection';
//import { body } from 'express-validator';
//import { validateReqSchema } from '.';
//import { ProductPutController } from '../controllers/ProductPutController';

export const register = (router: Router) => {
  /*   const reqSchema = [
    body('id').exists().isString(),
    body('name').exists().isString(),
    body('description').exists().isString(),
    body('price').exists().isNumeric()
  ]; */

  const productPutController = container.get('Apps.marketplace.controllers.ProductPutController');
  router.put('/product/:id', (req: Request, res: Response) => productPutController.run(req, res));

  const productDeleteController = container.get('Apps.marketplace.controllers.ProductDeleteController');
  router.delete('/product?id', (req: Request, res: Response) => productDeleteController.run(req, res));
};
