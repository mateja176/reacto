import dotenv from 'dotenv';
import { EnvError } from '../utils/errors';

// * dotenv.config is invoked in setupTests.ts
if (process.env.NODE_ENV !== 'test') {
  // * in a production environment there is usually a platform specific way of injecting env vars
  dotenv.config();
}

if (!process.env.MONGODB_URI) {
  throw new EnvError('MONGODB_URI');
}

if (!process.env.JWT_SECRET) {
  throw new EnvError('JWT_SECRET');
}

if (!process.env.MAIL_GUN_API_KEY) {
  throw new EnvError('MAIL_GUN_API_KEY');
}
if (!process.env.MAIL_GUN_USERNAME) {
  throw new EnvError('MAIL_GUN_USERNAME');
}
if (!process.env.MAIL_GUN_EMAIL) {
  throw new EnvError('MAIL_GUN_EMAIL');
}

if (!process.env.APP_ORIGIN) {
  throw new EnvError('APP_ORIGIN');
}
if (!process.env.APP_EMAIL_PATH) {
  throw new EnvError('APP_EMAIL_PATH');
}

const env = {
  port: process.env.PORT ?? 4000,
  mongodbURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  mailGunApiKey: process.env.MAIL_GUN_API_KEY,
  mailGunUsername: process.env.MAIL_GUN_USERNAME,
  appOrigin: process.env.APP_ORIGIN,
  appEmailPath: process.env.APP_EMAIL_PATH,
  mailGunEmail: process.env.MAIL_GUN_EMAIL,
};

export default env;
