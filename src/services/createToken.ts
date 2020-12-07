import jwt from 'jsonwebtoken';
import { jwtAlgorithm } from '../config/jwt';
import env from './env';

const createToken = (user: Record<string, unknown>) => {
  return jwt.sign(user, env.jwtSecret, {
    algorithm: jwtAlgorithm,
    expiresIn: '2h',
  });
};

export default createToken;
