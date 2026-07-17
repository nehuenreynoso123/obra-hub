import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { RefreshToken } from '../../../../../Contexts/Auth/application/RefreshToken/RefreshToken';
import { Controller } from '../Controller';

type RefreshTokenRequest = {
  refreshToken: string;
};

export class RefreshTokenPostController implements Controller {
  constructor(private readonly refreshToken: RefreshToken) {}

  async run(req: Request<RefreshTokenRequest>, res: Response) {
    const response = await this.refreshToken.run({
      refreshToken: req.body.refreshToken
    });

    res.status(httpStatus.OK).json(response);
  }
}
