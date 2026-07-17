import { Express } from 'express';
import container from '../dependency-injection';
import { SignUpPostController } from '../controllers/Auth/SignUpPostController';
import { SignInPostController } from '../controllers/Auth/SignInPostController';
import { RefreshTokenPostController } from '../controllers/Auth/RefreshTokenPostController';

export const register = (app: Express) => {
  const signUpPostController: SignUpPostController = container.get(
    'Apps.Backoffice.Backend.controllers.Auth.SignUpPostController'
  );
  const signInPostController: SignInPostController = container.get(
    'Apps.Backoffice.Backend.controllers.Auth.SignInPostController'
  );
  const refreshTokenPostController: RefreshTokenPostController = container.get(
    'Apps.Backoffice.Backend.controllers.Auth.RefreshTokenPostController'
  );

  app.post('/auth/signup', signUpPostController.run.bind(signUpPostController));
  app.post('/auth/signin', signInPostController.run.bind(signInPostController));
  app.post('/auth/refresh-token', refreshTokenPostController.run.bind(refreshTokenPostController));
};
