import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from './Controller';

/* type AccountPutRequest = Request & {
  body: {
    id: string;
    name: string;
    email: string;
    password: string;
    zone: string;
  };
}; */

export class AccountPutController implements Controller {
  constructor() {}

  async run(req: Request, res: Response) {
    res.status(httpStatus.CREATED).send();
  }

  /* async run(req: Request, res: Response) {
    throw new Error('Method not implemented.');
  } */
}
