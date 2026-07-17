import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { TypeOrmClientFactory } from '../../../../../src/Contexts/Shared/infrastructure/persistence/typeorm/TypeOrmClientFactory';
import { TypeOrmAuthUserRepository } from '../../../../../src/Contexts/Auth/infrastructure/persistence/typeorm/TypeOrmAuthUserRepository';
import { BCryptPasswordHasher } from '../../../../../src/Contexts/Auth/infrastructure/BCryptPasswordHasher';
import { JwtTokenGenerator } from '../../../../../src/Contexts/Auth/infrastructure/JwtTokenGenerator';
import { SignUp } from '../../../../../src/Contexts/Auth/application/SignUp/SignUp';
import { SignIn } from '../../../../../src/Contexts/Auth/application/SignIn/SignIn';
import { RefreshToken } from '../../../../../src/Contexts/Auth/application/RefreshToken/RefreshToken';
import { SignUpPostController } from '../../../../../src/apps/backoffice/backend/controllers/Auth/SignUpPostController';
import { SignInPostController } from '../../../../../src/apps/backoffice/backend/controllers/Auth/SignInPostController';
import { RefreshTokenPostController } from '../../../../../src/apps/backoffice/backend/controllers/Auth/RefreshTokenPostController';
import { createJwtAuthGuardMiddleware } from '../../../../../src/Contexts/Auth/infrastructure/JwtAuthGuardMiddleware';
import { AuthUserEmail } from '../../../../../src/Contexts/Auth/domain/AuthUserEmail';
import Router from 'express-promise-router';
import cors from 'cors';

let dataSource: DataSource;
let app: express.Express;

const ACCESS_SECRET = 'test-access-secret-integration';
const REFRESH_SECRET = 'test-refresh-secret-integration';

beforeAll(async () => {
  try {
    dataSource = await TypeOrmClientFactory.createClient('auth-test', {
      host: 'localhost',
      port: 5432,
      username: 'codely',
      password: 'codely',
      database: 'mooc-backend-dev'
    });
  } catch {
    console.warn('PostgreSQL not available — skipping auth integration tests');
    return;
  }

  const repository = new TypeOrmAuthUserRepository(Promise.resolve(dataSource));
  const passwordHasher = new BCryptPasswordHasher();
  const tokenGenerator = new JwtTokenGenerator(ACCESS_SECRET, REFRESH_SECRET);

  const signUp = new SignUp(repository, passwordHasher);
  const signIn = new SignIn(repository, passwordHasher, tokenGenerator);
  const refreshToken = new RefreshToken(tokenGenerator);

  const signUpController = new SignUpPostController(signUp);
  const signInController = new SignInPostController(signIn);
  const refreshTokenController = new RefreshTokenPostController(refreshToken);

  app = express();
  app.use(bodyParser.json());

  const router = Router();
  router.use(cors());

  router.use(createJwtAuthGuardMiddleware(tokenGenerator));

  router.post('/auth/signup', signUpController.run.bind(signUpController));
  router.post('/auth/signin', signInController.run.bind(signInController));
  router.post('/auth/refresh-token', refreshTokenController.run.bind(refreshTokenController));

  router.get('/protected', (req, res) => {
    res.status(200).json({ user: (req as any).user });
  });

  app.use(router);
});

afterAll(async () => {
  if (dataSource) {
    const repository = new TypeOrmAuthUserRepository(Promise.resolve(dataSource));
    const email = new AuthUserEmail('integration-test@example.com');
    const user = await repository.findByEmail(email);
    if (user) {
      await dataSource.getRepository('AuthUser').delete({ email: email.value });
    }
    await dataSource.destroy();
  }
});

describe('Auth Integration', () => {
  const testUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'integration-test@example.com',
    password: 'testpassword123',
    name: 'Integration Test User'
  };

  describe('POST /auth/signup', () => {
    it('should create a user with hashed password in PostgreSQL', async () => {
      if (!dataSource) return;

      await request(app)
        .post('/auth/signup')
        .send(testUser)
        .expect(201);

      const repository = new TypeOrmAuthUserRepository(Promise.resolve(dataSource));
      const email = new AuthUserEmail(testUser.email);
      const savedUser = await repository.findByEmail(email);

      expect(savedUser).not.toBeNull();
      expect(savedUser!.email.value).toBe(testUser.email);
      expect(savedUser!.name.value).toBe(testUser.name);
      expect(savedUser!.password.value).not.toBe(testUser.password);
      expect(savedUser!.password.value).toMatch(/^\$2[aby]?\$/);
    });
  });

  describe('POST /auth/signin', () => {
    it('should return tokens for valid credentials', async () => {
      if (!dataSource) return;

      const response = await request(app)
        .post('/auth/signin')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(typeof response.body.accessToken).toBe('string');
      expect(typeof response.body.refreshToken).toBe('string');
    });
  });

  describe('Protected routes', () => {
    it('should return 401 without JWT', async () => {
      if (!dataSource) return;

      await request(app)
        .get('/protected')
        .expect(401);
    });

    it('should return 200 with valid JWT', async () => {
      if (!dataSource) return;

      const signinResponse = await request(app)
        .post('/auth/signin')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      const { accessToken } = signinResponse.body;

      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
    });
  });
});
