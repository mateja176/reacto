import { Company, QueryResolvers } from '../../../generated/resolvers';

const company: QueryResolvers['company'] = (): Company => ({
  id: '1',
  name: 'Acme',
});

export default company;
