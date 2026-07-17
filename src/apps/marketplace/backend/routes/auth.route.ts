import { Router } from 'express';
import container from '../dependency-injection';
import { SignUpPostController } from '../controllers/Auth/SignUpPostController';
import { SignInPostController } from '../controllers/Auth/SignInPostController';
import { RefreshTokenPostController } from '../controllers/Auth/RefreshTokenPostController';

export const register = (router: Router) => {
  const signUpPostController: SignUpPostController = container.get(
    'Apps.marketplace.controllers.Auth.SignUpPostController'
  );
  const signInPostController: SignInPostController = container.get(
    'Apps.marketplace.controllers.Auth.SignInPostController'
  );
  const refreshTokenPostController: RefreshTokenPostController = container.get(
    'Apps.marketplace.controllers.Auth.RefreshTokenPostController'
  );

  router.post('/auth/signup', signUpPostController.run.bind(signUpPostController));
  router.post('/auth/signin', signInPostController.run.bind(signInPostController));
  router.post('/auth/refresh-token', refreshTokenPostController.run.bind(refreshTokenPostController));
};
