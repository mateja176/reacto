import { AuthChecker } from 'type-graphql';
import { Context } from '../interfaces/Context';

const authChecker: AuthChecker<Context> = ({ context: { user } }, roles) => {
  return !!user && (roles.length === 0 || roles.includes(user.role));
};

export default authChecker;
