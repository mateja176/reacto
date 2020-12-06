import jwt from 'jsonwebtoken';
import { jwtAlgorithm } from '../config/jwt';
import { User } from '../entities/Company/entities/User/User';
import env from './env';

const createToken = (user: User) => {
  return jwt.sign({ ...user, id: String(user.id) }, env.jwtSecret, {
    algorithm: jwtAlgorithm,
    expiresIn: '2h',
  });
};

export default createToken;
