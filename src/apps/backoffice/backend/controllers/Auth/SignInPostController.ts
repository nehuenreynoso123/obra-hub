import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { SignIn } from '../../../../../Contexts/Auth/application/SignIn/SignIn';
import { Controller } from '../Controller';

type SignInRequest = {
  email: string;
  password: string;
};

export class SignInPostController implements Controller {
  constructor(private readonly signIn: SignIn) {}

  async run(req: Request<SignInRequest>, res: Response) {
    const response = await this.signIn.run({
      email: req.body.email,
      password: req.body.password
    });

    res.status(httpStatus.OK).json(response);
  }
}
