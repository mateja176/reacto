import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

const ormConfig: MongoConnectionOptions = {
  type: 'mongodb',
  entities: ['src/entity/**/*.ts'],
  useUnifiedTopology: true,
};

export default ormConfig;
