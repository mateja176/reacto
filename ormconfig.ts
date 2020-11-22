import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

const ormConfig: MongoConnectionOptions = {
  type: 'mongodb',
  useUnifiedTopology: true,
  synchronize: false,
  logging: true,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default ormConfig;
