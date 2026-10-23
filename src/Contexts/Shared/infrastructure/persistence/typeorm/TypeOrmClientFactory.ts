import { DataSource } from 'typeorm';
import { TypeOrmConfig } from './TypeOrmConfig';

export class TypeOrmClientFactory {
  static async createClient(contextName: string, config: TypeOrmConfig): Promise<DataSource> {
    // Schema synchronization and query logging are development conveniences only.
    // Outside development they must be opt-in: production schemas change through
    // migrations, never through an implicit diff at boot.
    const isProduction = process.env.NODE_ENV === 'production';

    const dataSource = new DataSource({
      name: contextName,
      type: 'postgres',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      entities: [__dirname + '/../../../../**/**/infrastructure/persistence/typeorm/*{.js,.ts}'],
      synchronize: !isProduction,
      logging: !isProduction
    });

    await dataSource.initialize();
    return dataSource;
  }
}
