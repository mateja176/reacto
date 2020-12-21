import { mongoose } from '@typegoose/typegoose';
import { mongodbConfig } from '../src/config/mongodb';
import env from '../src/services/env';

// ! for local usage only
(async () => {
  const connection = await mongoose.createConnection(
    env.mongodbURI,
    mongodbConfig,
  );

  await mongoose.connection.db.dropDatabase();

  await connection.close();
})();
