import { mongoose } from '@typegoose/typegoose';
import createServer from './createServer';
import env from './services/env';

mongoose.createConnection(env.mongodbURI).then((connection) => {
  return createServer(connection);
});
