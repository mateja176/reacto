import dotenv from 'dotenv';
import { EnvError } from './errors';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new EnvError('JWT_SECRET');
}

const env = {
  jwtSecret: process.env.JWT_SECRET,
};

export default env;
