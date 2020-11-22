import { AuthChecker } from 'type-graphql';
import { Context } from '../interfaces/interfaces';

const authChecker: AuthChecker<Context> = (resolverData, roles) => {
  return true;
};

export default authChecker;
