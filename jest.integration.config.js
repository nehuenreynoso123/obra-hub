// Integration test configuration.
//
// These suites require the backing services to be running locally:
//   docker compose up -d
// Postgres is not yet part of docker-compose.yml (it is added in Phase 0).
const integrationTests = [
  'tests/Contexts/Shared/infrastructure/TypeOrmClientFactory.test.ts',
  'tests/Contexts/Shared/infrastructure/MongoClientFactory.test.ts',
  'tests/Contexts/Shared/infrastructure/EventBus/RabbitMQEventBus.test.ts',
  'tests/Contexts/Shared/infrastructure/EventBus/DomainEventFailoverPublisher.test.ts',
  'tests/Contexts/Mooc/Courses/infrastructure/persistence/CourseRepository.test.ts',
  'tests/Contexts/Mooc/CoursesCounter/infrastructure/CoursesCounterRepository.test.ts',
  'tests/Contexts/Backoffice/Courses/infrastructure/BackofficeCourseRepository.test.ts'
];

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  cacheDirectory: '.tmp/jestCache',
  testMatch: integrationTests
};
