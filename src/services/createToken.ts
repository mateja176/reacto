import jwt from 'jsonwebtoken';
import { UserOutput } from '../resolvers/user/types';
import env from '../utils/env';

const createToken = (user: UserOutput) => {
  return jwt.sign({ ...user, id: String(user.id) }, env.jwtSecret, {
    algorithm: 'HS256',
  });
};

export default createToken;
