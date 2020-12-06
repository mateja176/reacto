import companyResolvers from './company';
import userResolvers from './user';

const resolvers = [...companyResolvers, ...userResolvers] as const;

export default resolvers;
