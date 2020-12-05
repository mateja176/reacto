import dotenv from 'dotenv';
import { EnvError } from './errors';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new EnvError('JWT_SECRET');
}
if (!process.env.MAIL_GUN_API_KEY) {
  throw new EnvError('MAIL_GUN_API_KEY');
}
if (!process.env.MAIL_GUN_USERNAME) {
  throw new EnvError('MAIL_GUN_USERNAME');
}

const env = {
  jwtSecret: process.env.JWT_SECRET,
  mailGunApiKey: process.env.MAIL_GUN_API_KEY,
  mailGunUsername: process.env.MAIL_GUN_USERNAME,
};

export default env;
