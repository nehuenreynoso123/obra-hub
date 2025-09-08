import { Router, Request, Response } from 'express';
import StatusController from '../controllers/StatusGetController';
//import container from '../dependency-injection';

export const register = (router: Router) => {
  const controller: StatusController = new StatusController();
  //const controller: StatusController = get.container.get('Apps.marketplace.controllers.StatusGetController')
  router.get('/status', (req: Request, res: Response) => controller.run(req, res));
};
