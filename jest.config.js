// Unit test configuration.
//
// Tests that need a live Postgres, MongoDB, RabbitMQ or Elasticsearch instance are
// excluded here and collected by jest.integration.config.js instead, so that
// `pnpm test:unit` stays fast and deterministic without provisioning services.
const integrationTests = [
  '<rootDir>/tests/Contexts/Shared/infrastructure/TypeOrmClientFactory.test.ts',
  '<rootDir>/tests/Contexts/Shared/infrastructure/MongoClientFactory.test.ts',
  '<rootDir>/tests/Contexts/Shared/infrastructure/EventBus/RabbitMQEventBus.test.ts',
  '<rootDir>/tests/Contexts/Shared/infrastructure/EventBus/DomainEventFailoverPublisher.test.ts',
  '<rootDir>/tests/Contexts/Mooc/Courses/infrastructure/persistence/CourseRepository.test.ts',
  '<rootDir>/tests/Contexts/Mooc/CoursesCounter/infrastructure/CoursesCounterRepository.test.ts',
  '<rootDir>/tests/Contexts/Backoffice/Courses/infrastructure/BackofficeCourseRepository.test.ts'
];

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  cacheDirectory: '.tmp/jestCache',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/apps/backoffice/frontend/',
    ...integrationTests
  ]
};
