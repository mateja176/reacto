import createServer from './createServer';
import env from './services/env';

createServer(env.mongodbURI);
