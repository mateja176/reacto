import jwt from 'jsonwebtoken';
import { jwtAlgorithm } from '../config/jwt';
import { JWTUser } from '../graphql/user/types/JWTUser';
import env from './env';

const createToken = (user: JWTUser) => {
  return jwt.sign(user, env.jwtSecret, {
    algorithm: jwtAlgorithm,
    expiresIn: '2h',
  });
};

export default createToken;
