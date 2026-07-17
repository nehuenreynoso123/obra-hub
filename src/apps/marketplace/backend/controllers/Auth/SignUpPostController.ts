import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { SignUp } from '../../../../../Contexts/Auth/application/SignUp/SignUp';
import { Controller } from '../Controller';

type SignUpRequest = {
  id: string;
  email: string;
  password: string;
  name: string;
};

export class SignUpPostController implements Controller {
  constructor(private readonly signUp: SignUp) {}

  async run(req: Request<SignUpRequest>, res: Response) {
    await this.signUp.run({
      id: req.body.id,
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    });

    res.status(httpStatus.CREATED).send();
  }
}
