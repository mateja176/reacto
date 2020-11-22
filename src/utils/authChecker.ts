import { AuthChecker } from 'type-graphql';
import { Context } from '../interfaces/interfaces';

const authChecker: AuthChecker<Context> = ({ context: { user } }, roles) => {
  return !!user && roles.includes(user.role);
};

export default authChecker;
