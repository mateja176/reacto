import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

const ormConfig: MongoConnectionOptions = {
  type: 'mongodb',
  useUnifiedTopology: true,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: false,
  logging: true,
};

export default ormConfig;
