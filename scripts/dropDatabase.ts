import { mongoose } from '@typegoose/typegoose';
import dotenv from 'dotenv';
import { mongodbConfig } from '../src/config/mongodb';
import env from '../src/services/env';

dotenv.config();

// ! for local usage only
(async () => {
  const connection = await mongoose.createConnection(
    env.mongodbURI,
    mongodbConfig,
  );

  await connection.db.dropDatabase();

  await connection.close();
})();
