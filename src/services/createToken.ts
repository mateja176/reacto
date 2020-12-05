import jwt from 'jsonwebtoken';
import { jwtAlgorithm } from '../config/jwt';
import { UserOutput } from '../resolvers/user/types/types';
import env from './env';

const createToken = (user: UserOutput) => {
  return jwt.sign({ ...user, id: String(user.id) }, env.jwtSecret, {
    algorithm: jwtAlgorithm,
    expiresIn: '2h',
  });
};

export default createToken;
